const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
