/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import useCategoriaTransacao from "../../../../hooks/useCategoriaTransacao";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import { FieldWrap } from "./styled";
import { useGlobal } from "../../../../contexts/UserContext";
import ReactSelect from "react-select";
import { ICategoriaTransacao } from "../../../../models/categoria-transacao.model";
import useSubCategoriaTransacao from "../../../../hooks/useSubCategoriaTransacao";

const handleSubmitRegisterSchema = z.object({
  nome: z
    .string()
    .min(1, {
      message: fieldRequired("nome"),
    }),
  tipo: z
    .number()
    .min(1, {
      message: fieldRequired('tipo')
    }),
  codigoSubCategoria: z
    .string()
    .min(1, {
      message: fieldRequired("Subcategoria")
    })
});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalUpdateCategoriaTransacao {
  handleClose: () => void
  data: ICategoriaTransacao
}

const ModalUpdateCategoriaTransacao = ({
  handleClose,
  data
}: IModalUpdateCategoriaTransacao) => {
  const { user } = useGlobal();
  const { updateCategoriaTransacao } = useCategoriaTransacao();
  const { getAllSubCategoriaTransacao } = useSubCategoriaTransacao()

  const {
    setValue,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
    defaultValues: {
      nome: data.nome,
      tipo: data.tipo
    }
  });
  const { mutate, isLoading } = updateCategoriaTransacao(reset, handleClose);
  const { data: dataSubCategoria, isLoading: isLoadingSubCategoria } = getAllSubCategoriaTransacao()

  const handleSubmitRegister = (submitData: IhandleSubmitRegister) => {
    mutate({
      ...submitData,
      id: data.id,
      codigoUsuario: user?.id
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

  return (
    <form
      onSubmit={handleSubmit(handleSubmitRegister)}
      style={{ width: "100%" }}
    >
      <Box display="flex" flexDirection="column" gap="25px" padding="30px">
        <span>
          (<Asterisk />) indica os campos obrigatórios
        </span>

        <FieldWrap>
          <span>
            Nome <Asterisk />
          </span>

          <Input
            placeholder="Digite o nome"
            id="nome"
            type="text"
            {...register("nome")}
          />
          {errors.nome && <p className="error">{errors.nome.message}</p>}
        </FieldWrap>

        <FieldWrap>
          <span>Tipo <Asterisk /></span>

          <Box display="flex" gap="10px">
            <ReactSelect
              className="select-fields large"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              {...register?.("tipo")}
              isSearchable={true}
              placeholder="Selecione"
              noOptionsMessage={() => "Não há origem cadastrado"}
              options={dataTipo
                ?.map((tipo) => ({
                  label: tipo?.nome,
                  value: tipo?.id,
                }))}
              name="origem"
              id="origem"
              onChange={(option) => {
                setValue("tipo", option?.value || 1);
              }}
              defaultValue={{
                label: data.tipo == 1 ? 'Débito' : 'Crédito',
                value: data.tipo
              }}
            />
          </Box>
        </FieldWrap>

        <FieldWrap>
          <span>Subcategoria <Asterisk /></span>

          <Box display="flex" gap="10px">
            <ReactSelect
              className="select-fields large"
              classNamePrefix="select"
              closeMenuOnSelect={true}
              {...register?.("codigoSubCategoria")}
              isSearchable={true}
              placeholder="Selecione"
              noOptionsMessage={() => "Não há subcategoria cadastrada"}
              options={dataSubCategoria
                ?.map((subcategoria) => ({
                  label: subcategoria?.nome,
                  value: subcategoria?.id,
                }))}
              name="codigoSubCategoria"
              id="codigoSubCategoria"
              onChange={(option) => {
                setValue("codigoSubCategoria", option?.value || '');
              }}
              defaultValue={{
                label: data.SubCategoria.nome,
                value: data.SubCategoria.id
              }}
            />
          </Box>
        </FieldWrap>

        <Flex justifyContent="flex-end" gap="15px">
          <Button
            isDisabled={
              isLoading
            }
            isLoading={isLoading}
            type="submit"
          >
            Salvar
          </Button>
        </Flex>
      </Box>
    </form>
  );
};

export default ModalUpdateCategoriaTransacao;
