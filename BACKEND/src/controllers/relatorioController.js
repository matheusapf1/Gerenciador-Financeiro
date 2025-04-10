const {
    getTotalGastosPorCategoria,
    getMediaGastosMensais,
    getTotalComprasMesAtual,
    getMesComMaiorGasto,
    getQuantidadeTotalCompras,
  } = require("../repositories/relatorioRepository");
  
  exports.obterRelatorio = async (req, res) => {
    try {
      const userId = req.user.id; // Supondo que o ID do usuário esteja disponível no objeto req.user
  
      const [
        totalGastosPorCategoria,
        mediaGastosMensais,
        totalComprasMesAtual,
        mesComMaiorGasto,
        quantidadeTotalCompras,
      ] = await Promise.all([
        getTotalGastosPorCategoria(userId),
        getMediaGastosMensais(userId),
        getTotalComprasMesAtual(userId),
        getMesComMaiorGasto(userId),
        getQuantidadeTotalCompras(userId),
      ]);
  
      res.status(200).json({
        totalGastosPorCategoria,
        mediaGastosMensais,
        totalComprasMesAtual,
        mesComMaiorGasto,
        quantidadeTotalCompras,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  