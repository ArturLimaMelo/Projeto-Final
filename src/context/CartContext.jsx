import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "./SessionContext";

export const CartContext = createContext({
  products: [],
  cart: [],
  loading: false,
  error: null,
  addToCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  removeFromCart: () => {},
  uniqueProducts: [],
  addProduct: () => {},
  removeProduct: () => {},
  updateProduct: () => {},
  removeProductFromDB: () => {}
});

export function CartProvider({ children }) {
  const { session } = useContext(SessionContext);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let mounted = true;

  useEffect(() => {
  if (!session) {
    setProducts([]);
    setCart([]);
    setLoading(false);
    fetchProductsSupabase();
    return;
  }



  async function fetchProductsSupabase() {
    try {
      const { data, error: fetchError } = await supabase.from("produto").select("*");
      if (!mounted) return;
      if (fetchError) {
        console.error("fetchProductsSupabase error:", fetchError);
        setError(fetchError.message || JSON.stringify(fetchError));
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error("fetchProductsSupabase exception:", err);
      if (mounted) setError(String(err));
      if (mounted) setProducts([]);
    }
  }
  async function fetchCartSupabase() {
    if (!session || !session.user || !session.user.id) {
      if (mounted) setCart([]);
      if (mounted) setLoading(false);
      return;
    }

    try {
      const { data, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", session.user.id);

      if (!mounted) return;

      if (cartError) {
        console.error("fetchCartSupabase error:", cartError);
        setError(cartError.message || JSON.stringify(cartError));
        setCart([]);
      } else {
        setCart(data || []);
      }
    } catch (err) {
      console.error("fetchCartSupabase exception:", err);
      if (mounted) setError(String(err));
      if (mounted) setCart([]);
    } finally {
      if (mounted) setLoading(false);
    }
  }

  setLoading(true);
  fetchProductsSupabase();
  fetchCartSupabase();

  return () => {
    mounted = false;
  };
}, [session]);

  const removeProductFromDB = async (id) =>{

       try {
        const { error } = await supabase.from("produto").delete().eq("product_id", id);
        if (error) {
          console.error("Erro ao remover produto do DB:", error);
        } else {
          removeProduct(id);
        }
      } catch (err) {
        console.error("Exceção ao remover produto do DB:", err);
      }
    };
  const updateProduct = async (updated) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));

    try {
      const payload = {
        title: updated.title,
        price: updated.price,
        description: updated.description,
        thumbnail: updated.thumbnail,
      };

      const { error } = await supabase.from("produto").update(payload).eq("product_id", updated.id);
    } catch (err) {
      console.error("updateProduct exception:", err);
      setError(String(err));
    }
  };
  
  const addToCart = (product) => {
    // normalize local cart row to match supabase shape where possible
    const productId = product.product_id ?? product.id;
    const row = {
      product_id: productId,
      qty: 1,
      product: product,
    };
    setCart((prev) => [...prev, row]);
    async function addCartItem(prod) {
      if (!session) {
        setError("Entre em sua conta para modificar o carrinho");
        return;
      }
      try {
        const { data: existing, error: fetchErr } = await supabase
          .from("cart")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("product_id", prod.product_id)
          .maybeSingle();

        if (existing) {
          const newQty = existing.qty + 1;
          const { error: updateErr } = await supabase
            .from("cart")
            .update({ qty: newQty })
            .eq("user_id", session.user.id)
            .eq("product_id", prod.product_id);
          return;
        }
        if (fetchErr) {
          console.error("Error checking existing cart item:", fetchErr);
        }
        const { error: insertErr } = await supabase.from("cart").insert({
          user_id: session.user.id,
          product_id: prod.product_id,
          qty: 1,
        });
        if (insertErr) {
          console.error("Error adding item to cart:", insertErr);
        }
      } catch (err) {
        console.error("addToCart exception:", err);
        setError(String(err));
      }
    }

    addCartItem(product);
  };

  const updateQty = async (product, qty) => {
    if (!session) {
      setError("Entre em sua conta para modificar o carrinho");
      return;
    }

    try {
      const productId = product.product_id ?? product.id;

      const { error } = await supabase
        .from("cart")
        .update({ qty: qty })
        .eq("user_id", session.user.id)
        .eq("product_id", productId);
    } catch (err) {
      console.error("updateQty exception:", err);
      setError(String(err));
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        const idKey = item.product_id ?? item.id;
        const target = product.product_id ?? product.id;
        return idKey === target ? { ...item, qty: qty } : item;
      })
    );
  };

  const removeFromCart = async (product) => {
    const match = cart.find((item) => {
      const idKey = item.product_id ?? item.id;
      const target = product.product_id ?? product.id;
      return idKey === target || item.id === product.id;
    });

    if (!match) return;

    const currentQty = match.qty ?? match.quantity ?? 1;
    const rowId = match.id;
    const productId = match.product_id ?? match.product?.product_id ?? match.product?.id;

    if (currentQty > 1) {
      setCart((prevCart) =>
        prevCart.map((item) => {
          const idKey = item.product_id ?? item.id;
          return idKey === productId || item.id === rowId
            ? { ...item, qty: (item.qty ?? item.quantity ?? 1) - 1 }
            : item;
        })
      );
    } else {
      setCart((prevCart) => {
        const index = prevCart.findIndex(
          (item) => item.id === rowId || item.product_id === productId || item.id === product.id
        );
        if (index === -1) return prevCart;
        const newCart = [...prevCart];
        newCart.splice(index, 1);
        return newCart;
      });
    }

    // persist change to supabase
    if (!session) {
      setError("Entre em sua conta para modificar o carrinho");
      return;
    }

    try {
      if (currentQty > 1) {
        const { error: updErr } = await supabase
          .from("cart")
          .update({ qty: currentQty - 1 })
          .eq("user_id", session.user.id)
          .eq("product_id", productId);

      } else {
        const { error: delErr } = await supabase
          .from("cart")
          .delete()
          .eq("user_id", session.user.id)
          .eq("product_id", productId);
      }
    } catch (err) {
      console.error("removeFromCart exception:", err);
      setError(String(err));
    }
  };

  const productMap = {};
  cart.forEach((product) => {
    const idKey = product.product_id ?? product.id;
    const qty = product.qty ?? product.quantity ?? 1;
    if (productMap[idKey]) {
      productMap[idKey].qty += qty;
    } else {
      productMap[idKey] = { ...product, qty: qty, id: idKey };
    }
  });

  const uniqueProducts = Object.values(productMap);

  const clearCart = async (product) => {
    if (!session) return;

    const productId = product.product_id;
    setCart((prevCart) =>
    prevCart.filter(
    (item) =>
    (item.product_id ?? item.id) !== productId
    )
    );
    try {
      const { error } = await supabase.from("cart")
      .delete()
      .eq("user_id", session.user.id)
      .eq("product_id", product.product_id);
    } catch (err) {
      console.error("clearCart exception:", err);
      setError(String(err));
    }
  };

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const context = {
    products,
    cart,
    loading,
    error,
    addToCart,
    updateQty,
    clearCart,
    removeFromCart,
    uniqueProducts,
    addProduct,
    removeProduct,
    updateProduct,
    removeProductFromDB
  };

  return <CartContext.Provider value={context}>{children}</CartContext.Provider>;
}