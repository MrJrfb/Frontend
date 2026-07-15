import React, { useState, useEffect } from 'react';

const EthereumPriceAdvanced = () => {
  // Estados
  const [price, setPrice] = useState(null);
  const [change24h, setChange24h] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("");

  // Función para consultar la API
  const fetchPriceData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum"
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos de CoinGecko");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setPrice(data[0].current_price);
        setChange24h(data[0].price_change_percentage_24h);

        // Hora de la última actualización
        setLastUpdate(
          new Date().toLocaleTimeString("es-PY", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          })
        );

        setError(null);
      } else {
        throw new Error("No se encontraron datos para Ethereum");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al cargar el componente
  useEffect(() => {
    fetchPriceData();
  }, []);

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading)
    return <div style={styles.card}>Cargando datos del mercado...</div>;

  if (error)
    return (
      <div style={{ ...styles.card, ...styles.error }}>
        Error: {error}
      </div>
    );

  const isPositive = change24h >= 0;
  const changeColor = isPositive ? "#00B16A" : "#E74C3C";
  const changeSymbol = isPositive ? "▲" : "▼";

  return (
    <div style={styles.card}>

      <div style={styles.header}>

        <div>
          <p style={styles.api}>COINGECKO API</p>
          <h2 style={styles.title}>Ethereum (ETH)</h2>
        </div>

        <img
          src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
          alt="Ethereum"
          style={styles.icon}
        />

      </div>

      <h1 style={styles.price}>
        {price ? formatCurrency(price) : "$0.00"}
      </h1>

      <div
        style={{
          ...styles.changeContainer,
          color: changeColor,
        }}
      >
        <span>{changeSymbol}</span>

        <span>
          {change24h
            ? `${Math.abs(change24h).toFixed(2)}%`
            : "0.00%"}{" "}
          (24 h)
        </span>
      </div>

      <p style={styles.update}>
        Última actualización: {lastUpdate}
      </p>

      <button
        style={styles.button}
        onClick={fetchPriceData}
      >
        Actualizar
      </button>

    </div>
  );
};

const styles = {
  card: {
    fontFamily: "'Segoe UI', sans-serif",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    maxWidth: "430px",
    margin: "40px auto",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    border: "1px solid #ececec",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
  },

  api: {
    display: "flex",
    alignItems: "left",
    margin: 0,
    color: "#8A94A6",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  title: {
    margin: "6px 0 0",
    fontSize: "30px",
    fontWeight: "700",
    color: "#1D2D50",
  },

  icon: {
    width: "48px",
    height: "48px",
  },

  price: {
    display: "flex",
    alignItems: "left",
    fontSize: "30px", /*52*/
    fontWeight: "700",
    color: "#081C3A",
    margin: "20px 0 10px",
  },

  changeContainer: {
    display: "flex",
    alignItems: "left",
    gap: "8px",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "18px",
  },

  update: {
    color: "#8A94A6",
    fontSize: "16px",
    marginBottom: "28px",
  },

  button: {
    width: "100%",
    background: "#181E3D",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "20px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    color: "#E74C3C",
    textAlign: "center",
  },
};

export default EthereumPriceAdvanced;