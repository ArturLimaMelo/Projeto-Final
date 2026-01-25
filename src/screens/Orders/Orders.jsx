import styles from "./Orders.module.css";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../context/SessionContext";
import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabase";
import { Package, Calendar, CreditCard, DollarSign } from "lucide-react";

export default function Orders() {
    const { session } = useContext(SessionContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productDetailsMap, setProductDetailsMap] = useState({});

    useEffect(() => {
        if (!session) {
            navigate("/");
            return;
        }

        fetchOrders();
    }, [session, navigate]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", session.user.id)
                .order("order_id", { ascending: false });

            if (error) {
                console.error("Erro ao buscar pedidos:", error);
                return;
            }

            setOrders(data || []);
            const allProductIds = [];
            (data || []).forEach(order => {
                try {
                    const productIds = JSON.parse(order.product_list_id);
                    allProductIds.push(...productIds);
                } catch (err) {
                    console.error("Erro ao parsear product_list_id:", err);
                }
            });

            const uniqueProductIds = [...new Set(allProductIds)];

            if (uniqueProductIds.length > 0) {
                fetchProductDetails(uniqueProductIds);
            }
        } catch (err) {
            console.error("Erro ao buscar pedidos:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetails = async (productIds) => {
        try {
            const { data, error } = await supabase
                .from("produto")
                .select("*")
                .in("product_id", productIds);

            if (error) {
                console.error("Erro ao buscar detalhes dos produtos:", error);
                return;
            }

            const map = {};
            (data || []).forEach(product => {
                map[product.product_id] = product;
            });
            setProductDetailsMap(map);
        } catch (err) {
            console.error("Erro ao buscar detalhes dos produtos:", err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Meus Pedidos</h1>
                <div className={styles.loading}>
                    <p>Carregando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1><Package /> Meus Pedidos</h1>

            {orders.length === 0 ? (
                <div className={styles.empty}>
                    <Package size={64} />
                    <h2>Nenhum pedido encontrado</h2>
                    <p>Você ainda não fez nenhum pedido.</p>
                    <button
                        className={styles.shopButton}
                        onClick={() => navigate("/shop")}
                    >
                        Começar a comprar
                    </button>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {orders.map((order) => {
                        let productIds = [];
                        let quantities = [];

                        try {
                            productIds = JSON.parse(order.product_list_id);
                            quantities = JSON.parse(order.product_list_qty);
                        } catch (err) {
                            console.error("Erro ao parsear dados do pedido:", err);
                        }

                        return (
                            <div key={order.order_id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <div className={styles.orderInfo}>
                                        <h3>Pedido #{order.order_id}</h3>
                                        <p className={styles.orderDate}>
                                            <Calendar size={16} />
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className={styles.orderStatus}>
                                        <span className={styles.statusBadge}>
                                            {order.payment_method}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.orderProducts}>
                                    {productIds.map((productId, index) => {
                                        const product = productDetailsMap[productId];
                                        const quantity = quantities[index] || 1;

                                        if (!product) {
                                            return (
                                                <div key={productId} className={styles.productItem}>
                                                    <p>Produto não encontrado (ID: {productId})</p>
                                                    <p>Quantidade: {quantity}</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={productId} className={styles.productItem}>
                                                <img
                                                    src={product.product_thumbnail}
                                                    alt={product.product_title}
                                                    className={styles.productImage}
                                                />
                                                <div className={styles.productDetails}>
                                                    <h4>{product.product_title}</h4>
                                                    <p>Quantidade: {quantity}</p>
                                                    <p className={styles.productPrice}>
                                                        R$ {(product.price * quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className={styles.orderFooter}>
                                    <div className={styles.paymentInfo}>
                                        <CreditCard size={16} />
                                        <span>{order.payment_method}</span>
                                    </div>
                                    <div className={styles.totalAmount}>
                                        <DollarSign size={16} />
                                        <span>R$ {order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
