import styles from "./Shop.module.css";

import ProductList from "../../components/ProductList.jsx";

export default function Shop() {

    const products = [
        {
          id: 1,
          title: "Notebook Gamer1",
          description: "Notebook potente para jogos1",
          price: 4500,
          thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXh_bZlRIATH5np_lov3czH_SAsPyFdfD9Ng&s"
        },
        {
            id: 2,
            title: "Notebook Gamer2",
            description: "Notebook potente para jogos2",
            price: 5400,
            thumbnail: "https://media.pichau.com.br/media/catalog/product/cache/2f958555330323e505eba7ce930bdf27/g/6/g614ju-n3380w.jpg"
        }
    ];

    return (
        <>
        <ProductList products={products}></ProductList>
        </>
    );
}