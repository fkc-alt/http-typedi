export enum ModuleMetadata {
  IMPORTS = 'imports',
  PROVIDERS = 'providers',
  CONTROLLERS = 'controllers',
  EXPORTS = 'exports'
}

export enum MetadataKey {
  TYPE_METADATA = 'design:type',
  PARAMTYPES_METADATA = 'design:paramtypes',
  RETURNTYPE_METADATA = 'design:returntype',
  INJECTABLE_WATERMARK = '__injectable__',
  REQUEST_SERVICE = '__request__',
  GLOBAL = '__global__',
  ROUTE_ARGS_METADATA = '__routeArguments__',
  CUSTOM_ROUTE_ARGS_METADATA = '__customRouteArguments__',
  PARSE_INT_PIPE = '__parseIntPipe__',
  DEFAULT_VALUE_PIPE = '__defaultValuePipe__',
  INJECTIONS = '__injections__',
  SLEEPTIMER = '__sleepTimer__',
  TIMEOUT = '__timeout__',
  OPTIONAL = '__optional__',
  VERSION = '__version__',
  METADATATYPE = '__metadataType__',
  TOKEN = '__token__',
  CATCH_METADATA = 'design:catch',
  REQUEST_METADATA = 'design:request',
  INTERCEPTORSREQ_METADATA = 'design:interceptorsreq',
  INTERCEPTORSRES_METADATA = 'design:interceptorsres',
  TIMEOUTCALLBACK_METADATA = 'design:timeoutcallback',
  MIDDLEWARECONFIGPROXYEXCLUDE_METADATA = 'design:exclude',
  MIDDLEWARECONFIGPROXYFORROUTES_METADATA = 'design:forRoutes'
}

export enum RequestMethod {
  get = 'get',
  post = 'post',
  delete = 'delete',
  put = 'put',
  head = 'head',
  options = 'options',
  patch = 'patch',
  link = 'link',
  unlink = 'unlink',
  GET = 'GET',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  PURGE = 'PURGE',
  LINK = 'LINK',
  UNLINK = 'UNLINK',
  HEAD = 'HEAD'
}

export enum MethodMapping {
  GET = 'GetMapping',
  DELETE = 'DeleteMapping',
  OPTIONS = 'OptionsMapping',
  POST = 'PostMapping',
  PUT = 'PutMapping',
  PATCH = 'PatchMapping',
  HEAD = 'HeadMapping'
}

export enum RouteParamtypes {
  REQUEST,
  RESPONSE,
  NEXT,
  BODY,
  QUERY,
  PARAM,
  HEADERS,
  SESSION,
  FILE,
  FILES,
  HOST,
  IP,
  CUSTOMPARAM
}

export enum MetaDataTypes {
  REQUEST = 'request',
  BODY = 'data',
  PARAM = 'param',
  HEADERS = 'headers',
  CUSTOMARGS = 'customArgs',
  RESPONSE = 'response'
}

export enum ContentType {
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data',
  JSON = 'application/json'
}

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505
}
