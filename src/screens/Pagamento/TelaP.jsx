import styles from "./TelaP.module.css";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../context/SessionContext";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router";
import { CircleUser, Truck, CreditCard, Check } from "lucide-react";
import { supabase } from "../../utils/supabase";
import PIXCode from "./PIXCode.png";

export default function TelaP() {
    const { session } = useContext(SessionContext);
    const navigate = useNavigate();
    const { uniqueProducts } = useContext(CartContext);
    const [productDetailsMap, setProductDetailsMap] = useState({});
    const [userName, setUserName] = useState("Usuário");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        if (!session) {
            navigate("/");
        }
    });

    useEffect(() => {
        console.log(session.user.id);
        async function fetchUserName() {
            try {
                const { data, error } = await supabase
                    .from("usuario")
                    .select("name")
                    .eq("id", session.user.id)
                    .single();
                if (error) {
                    console.error("Erro ao buscar nome de usuário:", error);
                    return;
                }
                setUserName(data.name);
            } catch (err) {
                console.error("Erro ao buscar nome de usuário:", err);
            }
        }

        if (session) {
            fetchUserName();
        }
    }, [session]);

    useEffect(() => {
        async function fetchAddresses() {
            try {
                const { data, error } = await supabase
                    .from("address")
                    .select("*")
                    .eq("user_id", session.user.id);

                if (error) {
                    console.error("Erro ao buscar endereços:", error);
                    return;
                }

                setAddresses(data || []);
                if (data && data.length > 0) {
                    setSelectedAddressId(data[0].id);
                }
            } catch (err) {
                console.error("Erro ao buscar endereços:", err);
            }
        }

        if (session) {
            fetchAddresses();
        }
    }, [session]);

    useEffect(() => {
        const ids = uniqueProducts
            .map((u) => u.product_id ?? u.id)
            .filter(Boolean);
        if (ids.length === 0) {
            setProductDetailsMap({});
            return;
        }

        let mounted = true;
        async function fetchDetails() {
            try {
                const { data, error } = await supabase
                    .from("produto")
                    .select("*")
                    .in("product_id", ids);
                if (!mounted) return;
                if (error) {
                    console.error("Error fetching product details:", error);
                    return;
                }
                const map = {};
                (data || []).forEach((d) => {
                    const key = d.product_id ?? d.id;
                    if (key) map[key] = d;
                });
                setProductDetailsMap(map);
            } catch (err) {
                console.error("fetchDetails exception:", err);
            }
        }

        fetchDetails();
        return () => {
            mounted = false;
        };
    }, [uniqueProducts]);

    const subtotal = uniqueProducts.reduce(
        (acc, p) =>
            acc + ((productDetailsMap[p.product_id ?? p.id]?.price ?? p.price ?? 0) * (p.qty ?? p.quantity ?? 1)),
        0
    );

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    const handleFinalizePayment = async () => {
        alert("Pagamento via Pix finalizado! (Simulação)");
        try {
            const productIds = uniqueProducts.map(p => p.product_id ?? p.id);
            const quantities = uniqueProducts.map(p => p.qty ?? p.quantity ?? 1);

            const { data, error } = await supabase.from("orders").insert([{
                order_id: crypto.randomUUID(),
                user_id: session.user.id,
                product_list_id: JSON.stringify(productIds),
                product_list_qty: JSON.stringify(quantities),
                total: subtotal,
                payment_method: "PIX",
            }]);

            if (error) {
                console.error("Erro ao registrar pedido:", error);
            } else {
                console.log("Pedido registrado com sucesso:", data);
            }
        } catch(err) {
            console.error("Erro ao registrar pedido:", err);
        }

        try {
            for (const product of uniqueProducts) {
                const productId = product.product_id;
                const qtyBought = product.qty ?? product.quantity ?? 1;
                const currentStock = productDetailsMap[productId]?.stock;
                const newStock = Math.max(0, currentStock - qtyBought); 

                const { error: updateError } = await supabase
                    .from("produto")
                    .update({ stock: newStock })
                    .eq("product_id", productId);

                if (updateError) {
                    console.error(`Erro ao atualizar estoque do produto ${productId}:`, updateError);
                } else {
                    console.log(`Estoque do produto ${productId} atualizado para ${newStock}`);
                }
            }
        } catch (err) {
            console.error("Erro ao atualizar estoques:", err);
        }

        try {
            const {data} = await supabase.from("cart").delete().eq("user_id", session.user.id);
        } catch (err) {
            console.error("Erro ao limpar carrinho após pagamento:", err);
        }
        
        navigate("/");
    };

    return (
        <div className={styles.container}>
            <h1>Pagamento via PIX</h1>

            <div className={styles.userInfo}>
                <h1><CircleUser /> Contato</h1>
                <p>Nome: {userName}</p>
                <p>Email: {session?.user?.email}</p>
            </div>

            <div className={styles.addressInfo}>
                <h1><Truck /> Endereço de Entrega</h1>
                {selectedAddress ? (
                    <div className={styles.selectedAddress}>
                        <p><strong>{selectedAddress.street}, {selectedAddress.number}</strong></p>
                        <p>{selectedAddress.complement && `${selectedAddress.complement} - `}{selectedAddress.neighborhood}</p>
                        <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.cep}</p>
                    </div>
                ) : (
                    <p>Nenhum endereço selecionado.</p>
                )}
            </div>

            <div className={styles.payment}>
                <h1><CreditCard /> Pagamento</h1>
                <div className={styles.pixInfo}>
                    <p><strong>Método de Pagamento: PIX</strong></p>
                    <p>Transferência instantânea</p>
                    <div className={styles.pixDetails}>
                        <p>Chave PIX: arturmelo95@gmail.com</p>
                        <p>Valor: R$ {subtotal.toFixed(2)}</p>
                        <div className={styles.qrPlaceholder}>
                            <img src={PIXCode} alt="Código QR do PIX"/>
                            <p>Escaneie o código QR para pagar</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.SummaryPanel}>
                <h1>Resumo do Pedido</h1>
                <div className={styles.productsList}>
                    {uniqueProducts.length === 0 ? (
                        <p>Seu carrinho está vazio.</p>
                    ) : (
                        uniqueProducts.map((product) => {
                            const idKey = product.product_id ?? product.id;
                            const details = productDetailsMap[idKey] || {};

                            const display = {
                                id: idKey,
                                product_title: details.product_title ?? product.product_title,
                                product_thumbnail: details.product_thumbnail ?? product.product_thumbnail,
                                price: details.price ?? product.price ?? 0,
                                qty: product.qty ?? product.quantity ?? 1,
                            };

                            return (
                                <div key={idKey} className={styles.orderProduct}>
                                    <img src={display.product_thumbnail} alt={display.product_title} />
                                    <div className={styles.productInfo}>
                                        <h3>{display.product_title}</h3>
                                        <p>Quantidade: {display.qty}</p>
                                        <p className={styles.price}>R$ {(display.price * display.qty).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <p className={styles.subtotal}>Subtotal: R$ {subtotal.toFixed(2)}</p>
                <button className={styles.finalizeBtn} onClick={handleFinalizePayment}>
                    <Check /> Finalizar Pagamento
                </button>
            </div>
        </div>
    );
}
