import styles from "./Checkout.module.css";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../context/SessionContext";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router";
import { CircleUser, Truck, CreditCard, Check } from "lucide-react";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import { Form } from "@base-ui/react/form";
import { Button } from "@base-ui/react/button";
import { supabase } from "../../utils/supabase";


export default function Checkout() {
    const { session } = useContext(SessionContext);
    const navigate = useNavigate();
    const { uniqueProducts } = useContext(CartContext);
    const [address, setAddress] = useState({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [errors, setErrors] = useState({});
    const [productDetailsMap, setProductDetailsMap] = useState({});
    const [userName, setUserName] = useState("Usuário");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

    useEffect(() => {
        if (!session) {
            navigate("/")
        }
    });

    useEffect(() => {
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
                    setIsAddingNewAddress(false);
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


    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmitAddress = async (e) => {
        e.preventDefault();
        const newErrors = {};
        
        if (!address.street) newErrors.street = "Rua é obrigatória";
        if (!address.number) newErrors.number = "Número é obrigatório";
        if (!address.neighborhood) newErrors.neighborhood = "Bairro é obrigatório";
        if (!address.city) newErrors.city = "Cidade é obrigatória";
        if (!address.state) newErrors.state = "Estado é obrigatório";
        if (!address.zipCode) newErrors.zipCode = "CEP é obrigatório";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const { data, error } = await supabase.from("address").insert([{
                user_id: session.user.id,
                street: address.street,
                number: address.number,
                complement: address.complement,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
                cep: address.zipCode,
            }]);
            
            if (error) {
                console.error("Erro ao salvar endereço:", error);
                setErrors({ submit: "Erro ao salvar endereço" });
                return;
            }
            
            console.log("Endereço enviado com sucesso:", address);
            
            setAddress({
                street: "",
                number: "",
                complement: "",
                neighborhood: "",
                city: "",
                state: "",
                zipCode: "",
            });
            setIsAddingNewAddress(false);
            const { data: updatedAddresses } = await supabase
                .from("address")
                .select("*")
                .eq("user_id", session.user.id);
            
            setAddresses(updatedAddresses || []);
            if (updatedAddresses && updatedAddresses.length > 0) {
                setSelectedAddressId(updatedAddresses[updatedAddresses.length - 1].id);
            }
        } catch (err) {
            console.error("Erro ao salvar endereço:", err);
            setErrors({ submit: "Erro ao salvar endereço" });
        }
    };

    const subtotal = uniqueProducts.reduce(
        (acc, p) =>
            acc + ((productDetailsMap[p.product_id ?? p.id]?.price ?? p.price ?? 0) * (p.qty ?? p.quantity ?? 1)),
        0
    );

    function handleFinish() {
        if (uniqueProducts.length === 0) {
            setErrors({ cart: "Seu carrinho está vazio." });
            return;
        }
        if (paymentMethod === "") {
            setErrors({ payment: "Selecione um método de pagamento." });
            return;
        }
        navigate('/pagamento');
    }

    return (
        <div className={styles.container}>
            <h1>Finalizar Compra</h1>

            <div className={styles.userInfo}>
                <h1><CircleUser /> Contato</h1>
                <p>Nome: {userName}</p>
                <p>Email: {session?.user?.email}</p>
            </div>
            <div className={styles.addressInfo}>
                <h1><Truck />Entrega</h1>
                
                {!isAddingNewAddress && addresses.length > 0 && (
                    <div className={styles.addressSelector}>
                        <h3>Endereços cadastrados</h3>
                        <div className={styles.addressList}>
                            {addresses.map((addr) => (
                                <div key={addr.id} className={styles.addressOption}>
                                    <input
                                        type="radio"
                                        id={`address-${addr.id}`}
                                        name="address"
                                        value={addr.id}
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => setSelectedAddressId(addr.id)}
                                    />
                                    <label htmlFor={`address-${addr.id}`} className={styles.addressLabel}>
                                        <strong>{addr.street}, {addr.number}</strong>
                                        <p>{addr.complement && `${addr.complement} - `}{addr.neighborhood}</p>
                                        <p>{addr.city}, {addr.state} - {addr.cep}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button 
                            type="button" 
                            className={styles.addNewAddressBtn}
                            onClick={() => setIsAddingNewAddress(true)}
                        >
                            + Adicionar novo endereço
                        </button>
                    </div>
                )}
                
                {isAddingNewAddress && (
                    <Form className={styles.form} onSubmit={handleSubmitAddress} errors={errors}>
                        <Fieldset.Root className={styles.Fieldset}>
                            <Fieldset.Legend className={styles.Legend}>
                                Novo Endereço
                            </Fieldset.Legend>

                            <div className={styles.formRow}>
                                <Field.Root name="street" className={styles.Field}>
                                    <Field.Label className={styles.Label}>Rua</Field.Label>
                                    <Field.Control
                                        type="text"
                                        name="street"
                                        required
                                        value={address.street}
                                        onChange={handleInputChange}
                                        placeholder="Rua das Flores"
                                        className={styles.Input}
                                    />
                                    <Field.Error className={styles.Error} />
                                </Field.Root>

                                <Field.Root name="number" className={styles.Field}>
                                    <Field.Label className={styles.Label}>Número</Field.Label>
                                    <Field.Control
                                        type="text"
                                        name="number"
                                        required
                                        value={address.number}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        className={styles.Input}
                                    />
                                    <Field.Error className={styles.Error} />
                                </Field.Root>
                            </div>

                            <Field.Root name="complement" className={styles.Field}>
                                <Field.Label className={styles.Label}>Complemento (opcional)</Field.Label>
                                <Field.Control
                                    type="text"
                                    name="complement"
                                    value={address.complement}
                                    onChange={handleInputChange}
                                    placeholder="Apto 45, Bloco B"
                                    className={styles.Input}
                                />
                                <Field.Error className={styles.Error} />
                            </Field.Root>

                            <Field.Root name="neighborhood" className={styles.Field}>
                                <Field.Label className={styles.Label}>Bairro</Field.Label>
                                <Field.Control
                                    type="text"
                                    name="neighborhood"
                                    required
                                    value={address.neighborhood}
                                    onChange={handleInputChange}
                                    placeholder="Centro"
                                    className={styles.Input}
                                />
                                <Field.Error className={styles.Error} />
                            </Field.Root>

                            <div className={styles.formRow}>
                                <Field.Root name="city" className={styles.Field}>
                                    <Field.Label className={styles.Label}>Cidade</Field.Label>
                                    <Field.Control
                                        type="text"
                                        name="city"
                                        required
                                        value={address.city}
                                        onChange={handleInputChange}
                                        placeholder="São Paulo"
                                        className={styles.Input}
                                    />
                                    <Field.Error className={styles.Error} />
                                </Field.Root>

                                <Field.Root name="state" className={styles.Field}>
                                    <Field.Label className={styles.Label}>Estado</Field.Label>
                                    <Field.Control
                                        type="text"
                                        name="state"
                                        required
                                        value={address.state}
                                        onChange={handleInputChange}
                                        placeholder="SP"
                                        maxLength="2"
                                        className={styles.Input}
                                    />
                                    <Field.Error className={styles.Error} />
                                </Field.Root>

                                <Field.Root name="zipCode" className={styles.Field}>
                                    <Field.Label className={styles.Label}>CEP</Field.Label>
                                    <Field.Control
                                        type="text"
                                        name="zipCode"
                                        required
                                        value={address.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="01234-567"
                                        className={styles.Input}
                                    />
                                    <Field.Error className={styles.Error} />
                                </Field.Root>
                            </div>
                        </Fieldset.Root>

                        <div className={styles.formButtons}>
                            <Button type="submit" className={styles.Button}>
                                Salvar Endereço
                            </Button>
                            {addresses.length > 0 && (
                                <button 
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => setIsAddingNewAddress(false)}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </Form>
                )}
                
                {addresses.length === 0 && !isAddingNewAddress && (
                    <Form className={styles.form} onSubmit={handleSubmitAddress} errors={errors}>
                        <Fieldset.Root className={styles.Fieldset}>
                            <Fieldset.Legend className={styles.Legend}>
                                Endereço de Entrega
                            </Fieldset.Legend>

                            <div className={styles.formRow}>
                                <Field.Root name="street" className={styles.Field}>
                                    <Field.Label className={styles.Label}>Rua</Field.Label>
                                    <Field.Control
                                        type="text"
                                        name="street"
                                        required
                                        value={address.street}
                                        onChange={handleInputChange}
                                        placeholder="Rua das Flores"
                                        className={styles.Input}
                                    />
                                    <Field.Error className={styles.Error} />
                                </Field.Root>

                                <Field.Root name="number" className={styles.Field}>
                                    <Field.Label className={styles.Label}>Número</Field.Label>
                                    <Field.Control
                                        type="text"
                                        name="number"
                                        required
                                        value={address.number}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        className={styles.Input}
                                    />
                                    <Field.Error className={styles.Error} />
                                </Field.Root>
                            </div>

                            <Field.Root name="complement" className={styles.Field}>
                                <Field.Label className={styles.Label}>Complemento (opcional)</Field.Label>
                                <Field.Control
                                    type="text"
                                    name="complement"
                                    value={address.complement}
                                    onChange={handleInputChange}
                                    placeholder="Apto 45, Bloco B"
                                className={styles.Input}
                            />
                            <Field.Error className={styles.Error} />
                        </Field.Root>

                        <Field.Root name="neighborhood" className={styles.Field}>
                            <Field.Label className={styles.Label}>Bairro</Field.Label>
                            <Field.Control
                                type="text"
                                name="neighborhood"
                                required
                                value={address.neighborhood}
                                onChange={handleInputChange}
                                placeholder="Centro"
                                className={styles.Input}
                            />
                            <Field.Error className={styles.Error} />
                        </Field.Root>

                        <div className={styles.formRow}>
                            <Field.Root name="city" className={styles.Field}>
                                <Field.Label className={styles.Label}>Cidade</Field.Label>
                                <Field.Control
                                    type="text"
                                    name="city"
                                    required
                                    value={address.city}
                                    onChange={handleInputChange}
                                    placeholder="São Paulo"
                                    className={styles.Input}
                                />
                                <Field.Error className={styles.Error} />
                            </Field.Root>

                            <Field.Root name="state" className={styles.Field}>
                                <Field.Label className={styles.Label}>Estado</Field.Label>
                                <Field.Control
                                    type="text"
                                    name="state"
                                    required
                                    value={address.state}
                                    onChange={handleInputChange}
                                    placeholder="SP"
                                    maxLength="2"
                                    className={styles.Input}
                                />
                                <Field.Error className={styles.Error} />
                            </Field.Root>

                            <Field.Root name="zipCode" className={styles.Field}>
                                <Field.Label className={styles.Label}>CEP</Field.Label>
                                <Field.Control
                                    type="text"
                                    name="zipCode"
                                    required
                                    value={address.zipCode}
                                    onChange={handleInputChange}
                                    placeholder="01234-567"
                                    className={styles.Input}
                                />
                                <Field.Error className={styles.Error} />
                            </Field.Root>
                        </div>
                    </Fieldset.Root>

                    <Button type="submit" className={styles.Button}>
                        Confirmar Endereço
                    </Button>
                    </Form>
                )}
            </div>
            <div className={styles.payment}>
                <h1><CreditCard /> Pagamento</h1>
                <form className={styles.paymentForm}>
                    <fieldset className={styles.paymentFieldset}>
                        <legend className={styles.paymentLegend}>Método de Pagamento</legend>
                        
                        <div className={styles.paymentOption}>
                            <input
                                type="radio"
                                id="pix"
                                name="payment"
                                value="pix"
                                checked={paymentMethod === "pix"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className={styles.paymentInput}
                            />
                            <label htmlFor="pix" className={styles.paymentLabel}>
                                <span className={styles.paymentName}>PIX</span>
                                <span className={styles.paymentDesc}>Transferência instantânea</span>
                            </label>
                        </div>

                        <div className={styles.paymentOption}>
                            <input
                                type="radio"
                                id="creditCard"
                                name="payment"
                                value="creditCard"
                                checked={paymentMethod === "creditCard"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className={styles.paymentInput}
                                disabled
                            />
                            <label htmlFor="creditCard" className={styles.paymentLabel}>
                                <span className={styles.paymentName}>Cartão de Crédito</span>
                                <span className={styles.paymentDesc}>Parcelado em até 12x</span>
                            </label>
                        </div>

                        <div className={styles.paymentOption}>
                            <input
                                type="radio"
                                id="bankSlip"
                                name="payment"
                                value="bankSlip"
                                checked={paymentMethod === "bankSlip"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className={styles.paymentInput}
                                disabled
                            />
                            <label htmlFor="bankSlip" className={styles.paymentLabel}>
                                <span className={styles.paymentName}>Boleto</span>
                                <span className={styles.paymentDesc}>Vencimento em 3 dias úteis</span>
                            </label>
                        </div>

                        <div className={styles.paymentOption}>
                            <input
                                type="radio"
                                id="debit"
                                name="payment"
                                value="debit"
                                checked={paymentMethod === "debit"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className={styles.paymentInput}
                                disabled
                            />
                            <label htmlFor="debit" className={styles.paymentLabel}>
                                <span className={styles.paymentName}>Débito</span>
                                <span className={styles.paymentDesc}>Débito direto em conta</span>
                            </label>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div className={styles.SummaryPanel}>
                <h1>Resumo do pedido</h1>
                {errors.address && <p className={styles.error}>{errors.address}</p>}
                {errors.cart && <p className={styles.error}>{errors.cart}</p>}
                {errors.payment && <p className={styles.error}>{errors.payment}</p>}
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
                                        <p className={styles.price}>${(display.price * display.qty).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
                <button type="button" onClick={handleFinish}><Check /> Finalizar pedido</button>
            </div>
        </div>
    );
}