export interface IPacoteArgs {
  page: number;
  size: number;
  nome: string
  status?: number | string | null
  origem?: number | string | null
}

export interface IDataPacote {
  id: string,
  nome: string,
  descricao: string | null,
  ativo: boolean,
  origem: number,
  tipoTransporte: number,
  urlImagem: string | null,
  urlImgEsgotado: string | null,
  idWP: number | null,
  destino: string,
  categoria: number | null,
  codigoDestino: string | null,
  usuarioCadastro: string
  Produto: {
    id: string
    nome: string
  }[]
  Imagem: {
    id: string
    nome: string
    url: string
  }
  ImagemBloqueado: {
    id: string
    nome: string
    url: string
  }
  Galeria: {
    id: string
    nome: string
    url: string
  }[]
  Inclusos: {
    id: string
    nome: string
  }[]
}

export interface IPacoteResponse {
  data: IDataPacote[];
  count: number;
  isLoading: boolean;
}

export interface ICreatePacoteArgs {
  nome: string,
  valor: number,
  descricao: string | null,
  ativo: boolean,
  origem: number,
  tipoTransporte: number,
  urlImagem: string | null,
  urlImgEsgotado: string | null,
  destino: string,
  categoria: number | null,
  codigoDestino: string | null,
  usuarioCadastro: string
}

export interface IUpdatePacoteArgs extends ICreatePacoteArgs {
  id: string
}

export interface ICreatePacoteResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, ICreatePacoteArgs, unknown>;
}

export interface IUpdatePacoteResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, IUpdatePacoteArgs, unknown>;
}

export interface IDeletePacoteResponse {
  isLoading: boolean;
  mutate: UseMutateFunction<void, unknown, string, unknown>;
}
