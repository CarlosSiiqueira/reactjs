/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import useProduct from "../../../../hooks/useProducts";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import useFornecedor from "../../../../hooks/useFornecedor";
import { useGlobal } from "../../../../contexts/UserContext";
import SelectForm from "../../../../components/SelectForm";
import FormInputNumber from "../../../../components/FormInputNumber";
import FormInput from "../../../../components/FormInput";
import useExcursoes from "../../../../hooks/useExcursao";
import usePacotes from "../../../../hooks/usePacotes";
import { useState } from "react";
import useFormaPagamento from "../../../../hooks/useFormaPagamento";
import useTransacao from "../../../../hooks/useTransacao";
import { ITransacao } from "../../../../models/transacao.model";
import usePessoas from "../../../../hooks/usePessoas";
import useContaBancaria from "../../../../hooks/useContaBancaria";
import useCategoriaTransacao from "../../../../hooks/useCategoriaTransacao";

const handleSubmitRegisterSchema = z.object({
  tipo: z
    .number({
      required_error: fieldRequired("tipo")
    }),
  valor: z
    .number({
      required_error: fieldRequired("valor")
    }),
  numeroComprovanteBancario: z
    .string({
      required_error: fieldRequired("número do comprovante bancário")
    })
    .optional(),
  efetivado: z
    .number({
      required_error: fieldRequired("efetivado")
    }),
  codigoContaBancaria: z
    .string({
      required_error: fieldRequired("Conta Bancária")
    }),
  codigoCategoria: z
    .string({
      required_error: fieldRequired('Categoria')
    }),
  codigoPessoa: z
    .string()
    .optional(),
  codigoFornecedor: z
    .string()
    .optional(),
  codigoProduto: z
    .string()
    .optional(),
  codigoExcursao: z
    .string()
    .optional(),
  codigoPacote: z
    .string()
    .optional(),
  codigoFormaPagamento: z
    .string({
      required_error: fieldRequired("forma de pagamento")
    }),
  observacao: z
    .string()
    .optional()
});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalRecordCollaborator {
  handleClose: () => void
  data: ITransacao
}

const ModalUpdateTransacao = ({
  handleClose,
  data
}: IModalRecordCollaborator) => {
  const { user } = useGlobal();
  const { updateTransacao } = useTransacao();
  const { getAllFormaPagamentos } = useFormaPagamento();
  const { getProducts } = useProduct();
  const { getAllFornecedores } = useFornecedor();
  const { getExcursoes } = useExcursoes();
  const { getAllPacotes } = usePacotes();
  const { getAllPessoas } = usePessoas()
  const { getAllContaBancaria } = useContaBancaria()
  const { getAllCategoriaTransacao } = useCategoriaTransacao()

  const [codigoExcursao, setCodigoExcursao] = useState<string | undefined>(undefined);

  const {
    setValue,
    getValues,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
    defaultValues: {
      tipo: data.tipo,
      valor: data.valor,
      numeroComprovanteBancario: data.numeroComprovanteBancario ?? undefined,
      efetivado: data.efetivado ? 1 : 2,
      codigoPessoa: data.codigoPessoa ?? undefined,
      codigoFornecedor: data.codigoFornecedor ?? undefined,
      codigoProduto: data.codigoProduto ?? undefined,
      codigoExcursao: data.codigoExcursao ?? undefined,
      codigoPacote: data.codigoPacote ?? undefined,
      codigoFormaPagamento: data.codigoFormaPagamento,
      observacao: data.observacao || '',
      codigoContaBancaria: data.ContaBancaria?.id,
      codigoCategoria: data.CategoriaTransacao?.id
    }
  });

  const { mutate, isLoading } = updateTransacao(reset, handleClose);
  const { data: dataFormaPagamentos, isLoading: loadingFormaPagamentos } = getAllFormaPagamentos();
  const { data: dataExcursoes, isLoading: loadingExcursoes } = getExcursoes({ page: 1, size: 100 });
  const { data: dataClientes, isLoading: loadingClientes } = getAllPessoas();
  const { data: dataPacotes, isLoading: loadingPacotes } = getAllPacotes();
  const { data: dataFornecedores, isLoading: loadingFornecedores } = getAllFornecedores();
  const { data: dataProdutos, isLoading: loadingProdutos } = getProducts({ page: 1, size: 100 });
  const { data: dataContaBancaria, isLoading: isLoadingContaBancaria } = getAllContaBancaria();
  const { data: dataCategoria, isLoading: isLoadingCategoria } = getAllCategoriaTransacao()

  const handleSubmitRegister = (dataSubmit: IhandleSubmitRegister) => {
    mutate({
      ...dataSubmit,
      id: data.id,
      efetivado: dataSubmit.efetivado === 1,
      ativo: true,
      usuarioCadastro: user?.id ?? '',
    })
  };

  const dataTipo = [
    {
      id: 1,
      nome: "Débito"
    },
    {
      id: 2,
      nome: "Crédito"
    }
  ]

  const dataEfetivado = [
    {
      id: 1,
      nome: "Sim"
    },
    {
      id: 2,
      nome: "Não"
    }
  ]

  return (
    <form
      onSubmit={handleSubmit(handleSubmitRegister)}
      style={{ width: "100%" }}
    >
      <Box display="flex" flexDirection="column" gap="25px" padding="30px">
        <span>
          (<Asterisk />) indica os campos obrigatórios
        </span>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
        >
          <SelectForm
            name="tipo"
            label="Tipo"
            minW="50%"
            isRequired
            handleChange={(option) => {
              setValue("tipo", option?.value || 1);
            }}
            options={dataTipo
              ?.map((tipo) => ({
                label: tipo?.nome,
                value: tipo?.id,
              }))}
            defaultValue={{
              label: data.tipo == 1 ? "Débito" : "Crédito",
              value: data.tipo
            }}
            errors={errors.tipo}
          />

          <FormInputNumber
            height="40px"
            label="Valor"
            minWidth="200px"
            {...register("valor")}
            setValue={setValue}
            isMoneyValue
            flex="1.01"
            name="valor"
            maxLength={25}
            isRequired
            dontAllowNegative
            value={getValues("valor")}
            errors={errors.valor}
          />
        </Flex>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
        >

          <SelectForm
            name="codigoFormaPagamento"
            label="Forma de Pagamento"
            minW="135px"
            isRequired
            isLoading={loadingFormaPagamentos}
            handleChange={(option) => {
              setValue("codigoFormaPagamento", option?.value);
            }}
            options={dataFormaPagamentos
              ?.map((codigoFormaPagamento) => ({
                label: codigoFormaPagamento?.nome,
                value: codigoFormaPagamento?.id,
              }))}
            defaultValue={{
              label: data.FormaPagamento?.nome,
              value: data.FormaPagamento?.id
            }}
            errors={errors.codigoFormaPagamento}
          />

          <SelectForm
            name="codigoCategoria"
            label="Categoria"
            minW="135px"
            isRequired
            isLoading={isLoadingCategoria}
            handleChange={(option) => {
              setValue("codigoCategoria", option?.value);
            }}
            options={dataCategoria
              ?.map((codigoCategoria) => ({
                label: `${codigoCategoria?.nome} / ${codigoCategoria.SubCategoria.nome}`,
                value: codigoCategoria?.id,
              }))}
            defaultValue={{
              label: data.CategoriaTransacao?.nome,
              value: data.CategoriaTransacao?.id
            }}
            errors={errors.codigoCategoria}
          />
        </Flex>

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
        >

          <SelectForm
            name="codigoContaBancaria"
            label="Conta Bancária"
            minW="135px"
            isLoading={isLoadingContaBancaria}
            handleChange={(option) => {
              setValue("codigoContaBancaria", option?.value);
            }}
            options={dataContaBancaria
              ?.map((codigoContaBancaria) => ({
                label: codigoContaBancaria?.nome,
                value: codigoContaBancaria?.id,
              }))}
            defaultValue={{
              label: data.ContaBancaria?.nome,
              value: data.ContaBancaria?.id
            }}
            errors={errors.efetivado}
          />

          <SelectForm
            name="efetivado"
            label="Efetivado"
            minW="135px"
            handleChange={(option) => {
              setValue("efetivado", option?.value);
            }}
            options={dataEfetivado
              ?.map((efetivado) => ({
                label: efetivado?.nome,
                value: efetivado?.id,
              }))}
            defaultValue={{
              label: data.efetivado ? "Sim" : "Não",
              value: data.efetivado
            }}
            errors={errors.efetivado}
          />
        </Flex>

        <FormInput
          label="Nº do comprovante bancário"
          {...register("numeroComprovanteBancario")}
          errors={errors?.numeroComprovanteBancario}
        />

        <SelectForm
          name="codigoPacote"
          label="Pacote"
          minW="200px"
          isLoading={loadingPacotes}
          handleChange={(option) => {
            setValue("codigoPacote", option?.value);
          }}
          options={dataPacotes
            ?.map((codigoPacote) => ({
              label: codigoPacote?.nome,
              value: codigoPacote?.id,
            }))}
          defaultValue={{
            label: data.Pacotes?.nome,
            value: data.Pacotes?.id
          }}
          errors={errors.codigoPacote}
        />

        <SelectForm
          name="codigoExcursao"
          label="Excursão"
          minW="200px"
          isLoading={loadingExcursoes}
          handleChange={(option) => {
            setValue("codigoExcursao", option?.value);
            setCodigoExcursao(option?.value);
          }}
          options={dataExcursoes
            ?.map((codigoExcursao) => ({
              label: codigoExcursao?.nome,
              value: codigoExcursao?.id,
            }))}
          defaultValue={{
            label: data.Excursao?.nome,
            value: data.Excursao?.id
          }}
          errors={errors.codigoExcursao}
        />

        <SelectForm
          name="codigoPessoa"
          placeholder="Selecione"
          label="Passageiro"
          minW="200px"
          isLoading={loadingClientes}
          handleChange={(option) => {
            setValue("codigoPessoa", option?.value);
          }}
          options={dataClientes
            ?.map((codigoPessoa) => ({
              label: codigoPessoa?.nome,
              value: codigoPessoa?.id,
            }))}
          defaultValue={{
            label: data.Pessoas?.nome,
            value: data.Pessoas?.id
          }}
          errors={errors.codigoPessoa}
        />

        <SelectForm
          name="codigoFornecedor"
          label="Fornecedor"
          minW="200px"
          isLoading={loadingFornecedores}
          handleChange={(option) => {
            setValue("codigoFornecedor", option?.value);
          }}
          options={dataFornecedores
            ?.map((codigoFornecedor) => ({
              label: codigoFornecedor?.nome,
              value: codigoFornecedor?.id,
            }))}
          defaultValue={{
            label: data.Fornecedor?.nome,
            value: data.Fornecedor?.id
          }}
          errors={errors.codigoFornecedor}
        />

        <SelectForm
          name="codigoProduto"
          label="Produto"
          minW="200px"
          isLoading={loadingProdutos}
          handleChange={(option) => {
            setValue("codigoProduto", option?.value);
          }}
          options={dataProdutos
            ?.map((codigoProduto) => ({
              label: codigoProduto?.nome,
              value: codigoProduto?.id,
            }))}
          defaultValue={{
            label: data.Produtos?.nome,
            value: data.Produtos?.id
          }}
          errors={errors.codigoProduto}
        />

        <FormInput
          id="observacao"
          label="Observações"
          type="text"
          {...register("observacao")}
          register={register}
          inputArea={true}
          errors={errors.observacao}
        />

        <Flex justifyContent="flex-end" gap="15px">
          <Button
            isDisabled={
              isLoading
            }
            isLoading={isLoading}
            type="submit"
          >
            Cadastrar
          </Button>
        </Flex>
      </Box>
    </form>
  );
};

export default ModalUpdateTransacao;