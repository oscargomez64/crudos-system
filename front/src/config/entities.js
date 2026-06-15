export const entities = [
  {
    key: 'cliente',
    label: 'Clientes',
    singular: 'Cliente',
    endpoint: '/api/cliente',
    idField: 'IdCliente',
    description: 'Administra compradores mayoristas y minoristas.',
    fields: [
      { name: 'IdCliente', apiName: 'idCliente', label: 'ID cliente', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'Nombre', apiName: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'RFC', apiName: 'rfc', label: 'RFC', type: 'text', required: true },
      { name: 'Ciudad', apiName: 'ciudad', label: 'Ciudad', type: 'text', required: true },
      { name: 'TipoCliente', apiName: 'tipoCliente', label: 'Tipo de cliente', type: 'select', required: true, options: ['Mayorista', 'Minorista'] }
    ]
  },
  {
    key: 'cerveza',
    label: 'Cervezas',
    singular: 'Cerveza',
    endpoint: '/api/cerveza',
    idField: 'IdCerveza',
    description: 'Mantiene catalogo de estilos y precios por litro.',
    fields: [
      { name: 'IdCerveza', apiName: 'idCerveza', label: 'ID cerveza', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'Nombre', apiName: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'Estilo', apiName: 'estilo', label: 'Estilo', type: 'text', required: true },
      { name: 'GradoAlcohol', apiName: 'gradoAlcohol', label: 'Grado alcohol', type: 'decimal', required: true },
      { name: 'PrecioLitro', apiName: 'precioLitro', label: 'Precio litro', type: 'decimal', required: true }
    ]
  },
  {
    key: 'proveedor',
    label: 'Proveedores',
    singular: 'Proveedor',
    endpoint: '/api/proveedor',
    idField: 'IdProveedor',
    description: 'Gestiona proveedores de ingredientes.',
    fields: [
      { name: 'IdProveedor', apiName: 'idProveedor', label: 'ID proveedor', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'Nombre', apiName: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'Telefono', apiName: 'telefono', label: 'Telefono', type: 'text', required: true },
      { name: 'Ciudad', apiName: 'ciudad', label: 'Ciudad', type: 'text', required: true }
    ]
  },
  {
    key: 'ingrediente',
    label: 'Ingredientes',
    singular: 'Ingrediente',
    endpoint: '/api/ingrediente',
    idField: 'IdIngrediente',
    description: 'Controla insumos, unidades y stock disponible.',
    fields: [
      { name: 'IdIngrediente', apiName: 'idIngrediente', label: 'ID ingrediente', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'Nombre', apiName: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'UnidadMedida', apiName: 'unidadMedida', label: 'Unidad de medida', type: 'text', required: true },
      { name: 'StockActual', apiName: 'stockActual', label: 'Stock actual', type: 'decimal', required: true },
      { name: 'IdProveedor', apiName: 'idProveedor', label: 'ID proveedor', type: 'number', required: true }
    ]
  },
  {
    key: 'pedido',
    label: 'Pedidos',
    singular: 'Pedido',
    endpoint: '/api/pedido',
    listEndpoint: '/api/pedido/all',
    idField: 'IdPedido',
    description: 'Registra ventas vinculadas a clientes.',
    fields: [
      { name: 'IdPedido', apiName: 'idPedido', label: 'ID pedido', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'Fecha', apiName: 'fecha', label: 'Fecha', type: 'date', required: true },
      { name: 'TotalVenta', apiName: 'totalVenta', label: 'Total venta', type: 'decimal', required: true },
      { name: 'IdCliente', apiName: 'idCliente', label: 'ID cliente', type: 'number', required: true }
    ]
  },
  {
    key: 'pedido_cerveza',
    label: 'Pedido - Cerveza',
    singular: 'Pedido - Cerveza',
    endpoint: '/api/pedido_cerveza',
    listEndpoint: '/api/pedido_cerveza/all',
    compositeKeys: ['IdPedido', 'IdCerveza'],
    queryParams: { IdPedido: 'idPedido', IdCerveza: 'idCerveza' },
    description: 'Relaciona pedidos con cervezas vendidas.',
    fields: [
      { name: 'IdPedido', apiName: 'idPedido', label: 'ID pedido', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'IdCerveza', apiName: 'idCerveza', label: 'ID cerveza', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'CantidadLitros', apiName: 'cantidadLitros', label: 'Cantidad litros', type: 'decimal', required: true },
      { name: 'PrecioUnitarioAplicado', apiName: 'precioUnitarioAplicado', label: 'Precio aplicado', type: 'decimal', required: true }
    ]
  },
  {
    key: 'cerveza_ingrediente',
    label: 'Cerveza - Ingrediente',
    singular: 'Cerveza - Ingrediente',
    endpoint: '/api/cerveza_ingrediente',
    listEndpoint: '/api/cerveza_ingrediente/all',
    compositeKeys: ['IdCerveza', 'IdIngrediente'],
    queryParams: { IdCerveza: 'idCerveza', IdIngrediente: 'idIngrediente' },
    description: 'Relaciona recetas de cerveza con ingredientes.',
    fields: [
      { name: 'IdCerveza', apiName: 'idCerveza', label: 'ID cerveza', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'IdIngrediente', apiName: 'idIngrediente', label: 'ID ingrediente', type: 'number', required: true, readOnlyOnEdit: true },
      { name: 'CantidadRequerida', apiName: 'cantidadRequerida', label: 'Cantidad requerida', type: 'decimal', required: true }
    ]
  }
];
