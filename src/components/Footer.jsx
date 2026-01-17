import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
            <h3>NeoMarketX</h3>

        <div className={styles.panel}>
          <div className={styles.left}>
            <p>Plataforma de marketplace para compra e venda online</p>
            <ul>
              <li>Gerencie seus produtos</li>
              <li>Controle de estoque</li>
              <li>Compre com segurança</li>
              <li>Vendedores verificados</li>
            </ul>
          </div>
          <div className={styles.right}>
            <p>Contato</p>
            <ul>
              <li>Email: nmx@gmail.com</li>
              <li>Telefone: (xx) xxxxx-xxxx</li>
              <li>Endereço: Rua Exemplo, 123 - Cidade, Estado</li>
            </ul>
          </div>
        </div>
        <p className={styles.copyright}>© 2025 NeoMarketX - NMX. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
