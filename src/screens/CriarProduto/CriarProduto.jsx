import style from './CriarProduto.module.css';
import React, { useState, useContext, useEffect } from 'react';
import { SessionContext } from '../../context/SessionContext';
import { CartContext } from '../../context/CartContext';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router';

export default function CriarProduto() {
     const { session } = useContext(SessionContext);
     const { addProduct } = useContext(CartContext);
     const navigate = useNavigate();
     const userId = session?.user?.id;

     const generateProductId = () => {
          return 'PROD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
     };

     const [formData, setFormData] = useState({
          product_id: generateProductId(),
          product_thumbnail: '',
          product_title: '',
          product_description: '',
          price: '',
          owner_id: userId || '',
          stock: '',
          sold_by: ''
     });

     const [preview, setPreview] = useState('');
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);

     useEffect(() => {
          if (userId) {
               setFormData(prev => ({
                    ...prev,
                    owner_id: userId
               }));
               
               // Buscar a loja do usuário
               async function fetchStoreId() {
                    try {
                         const { data, error } = await supabase
                              .from('loja')
                              .select('store_id')
                              .eq('store_owner_id', userId)
                              .single();
                         
                         if (error) {
                              console.log('Loja não encontrada:', error);
                              setError('Você precisa ter uma loja para criar produtos');
                              return;
                         }
                         
                         if (data) {
                              setFormData(prev => ({
                                   ...prev,
                                   sold_by: data.store_id
                              }));
                         }
                    } catch (err) {
                         console.error('Erro ao buscar loja:', err);
                         setError('Erro ao buscar loja');
                    }
               }
               
               fetchStoreId();
          }
     }, [userId]);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({
               ...prev,
               [name]: value
          }));
     };

     const handleImageUrlChange = (e) => {
          const { value } = e.target;
          setFormData(prev => ({
               ...prev,
               product_thumbnail: value
          }));
          setPreview(value);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          
          if (!session) {
               setError('Você precisa estar logado para criar um produto');
               return;
          }

          if (!formData.sold_by) {
               setError('Erro: Loja não encontrada. Certifique-se de que você tem uma loja criada.');
               return;
          }

          if (!formData.owner_id) {
               setError('Erro: ID do usuário não encontrado. Por favor, faça login novamente.');
               return;
          }

          if (!formData.product_title || !formData.product_description || !formData.product_thumbnail || !formData.price || !formData.stock) {
               setError('Por favor, preencha todos os campos obrigatórios');
               return;
          }

          setLoading(true);
          setError(null);

          try {
               const productData = {
                    product_id: formData.product_id,
                    product_thumbnail: formData.product_thumbnail,
                    product_title: formData.product_title,
                    product_description: formData.product_description,
                    price: parseFloat(formData.price),
                    owner_id: formData.owner_id,
                    stock: parseInt(formData.stock),
                    sold_by: formData.sold_by
               };

               console.log('Dados a enviar:', productData);

               const { data, error: insertError } = await supabase
                    .from('produto')
                    .insert([productData])
                    .select();

               if (insertError) {
                    console.error('Erro ao inserir produto:', insertError);
                    console.error('Dados enviados:', productData);
                    setError('Erro ao criar produto: ' + insertError.message);
                    setLoading(false);
                    return;
               }

               console.log('Produto criado com sucesso:', data);
               
               
               setFormData({
                    product_id: generateProductId(),
                    product_thumbnail: '',
                    product_title: '',
                    product_description: '',
                    price: '',
                    owner_id: userId || '',
                    stock: '',
                    sold_by: ''
               });
               setPreview('');

               
               if (data && data.length > 0) {
                    addProduct(data[0]);
               }

               alert('Produto criado com sucesso!');
               navigate('/shop');

          } catch (err) {
               console.error('Exceção ao criar produto:', err);
               setError('Erro inesperado ao criar produto: ' + err.message);
          } finally {
               setLoading(false);
          }
     };
          

     return (
          <div className={style.criarProdutoContainer}>
               <div className={style.formWrapper}>
                    <h2>Criar Novo Produto</h2>
                    
                    {error && <div className={style.errorMessage}>{error}</div>}
                    
                    <form onSubmit={handleSubmit} className={style.form}>
                         {/* Product ID */}
                         <div className={style.formGroup}>
                              <label htmlFor="product_id">ID do Produto:</label>
                              <input
                                   type="text"
                                   id="product_id"
                                   name="product_id"
                                   value={formData.product_id}
                                   readOnly
                                   className={style.readOnlyField}
                              />
                         </div>

                         {/* Product Title */}
                         <div className={style.formGroup}>
                              <label htmlFor="product_title">Título do Produto:</label>
                              <input
                                   type="text"
                                   id="product_title"
                                   name="product_title"
                                   value={formData.product_title}
                                   onChange={handleChange}
                                   placeholder="Digite o título do produto"
                                   required
                              />
                         </div>

                         {/* Product Description */}
                         <div className={style.formGroup}>
                              <label htmlFor="product_description">Descrição:</label>
                              <textarea
                                   id="product_description"
                                   name="product_description"
                                   value={formData.product_description}
                                   onChange={handleChange}
                                   placeholder="Digite a descrição do produto"
                                   rows="4"
                                   required
                              />
                         </div>

                         {/* Product Thumbnail */}
                         <div className={style.formGroup}>
                              <label htmlFor="product_thumbnail">Link da Imagem do Produto:</label>
                              <input
                                   type="text"
                                   id="product_thumbnail"
                                   name="product_thumbnail"
                                   value={formData.product_thumbnail}
                                   onChange={handleImageUrlChange}
                                   placeholder="https://exemplo.com/imagem.jpg"
                                   required
                              />
                              {preview && (
                                   <div className={style.imagePreview}>
                                        <img src={preview} alt="Prévia do produto" onError={(e) => e.target.style.display = 'none'} />
                                   </div>
                              )}
                         </div>

                         {/* Price */}
                         <div className={style.formGroup}>
                              <label htmlFor="price">Preço (R$):</label>
                              <input
                                   type="number"
                                   id="price"
                                   name="price"
                                   value={formData.price}
                                   onChange={handleChange}
                                   placeholder="0.00"
                                   step="0.01"
                                   min="0"
                                   required
                              />
                         </div>

                         {/* Owner ID */}
                         <div className={style.formGroup}>
                              <label htmlFor="owner_id">ID do Proprietário:</label>
                              <input
                                   type="text"
                                   id="owner_id"
                                   name="owner_id"
                                   value={formData.owner_id}
                                   readOnly
                                   className={style.readOnlyField}
                              />
                         </div>

                         {/* Stock */}
                         <div className={style.formGroup}>
                              <label htmlFor="stock">Quantidade em Estoque:</label>
                              <input
                                   type="number"
                                   id="stock"
                                   name="stock"
                                   value={formData.stock}
                                   onChange={handleChange}
                                   placeholder="0"
                                   min="0"
               
                                   required
                              />
                         </div>

                         {/* Sold By */}
                         <div className={style.formGroup}>
                              <label htmlFor="sold_by">Vendido Por:</label>
                              <input
                                   type="text"
                                   id="sold_by"
                                   name="sold_by"
                                   value={formData.sold_by}
                                   readOnly
                                   className={style.readOnlyField}
                              />
                         </div>

                         {/* Submit Button */}
                         <button type="submit" className={style.submitBtn} disabled={loading}>
                              {loading ? 'Criando Produto...' : 'Criar Produto'}
                         </button>
                    </form>
               </div>
          </div>
     );


    }
