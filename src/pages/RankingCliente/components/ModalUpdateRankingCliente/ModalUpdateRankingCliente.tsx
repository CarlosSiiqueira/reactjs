/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Asterisk from "../../../../components/Asterisk";

// Hooks
import useRankingCliente from "../../../../hooks/useRankingCliente";

import {
  fieldRequired
} from "../../../../utils/messagesError";

import { FieldWrap } from "./styled";
import { useGlobal } from "../../../../contexts/UserContext";
import { IRankingCliente } from "../../../../models/ranking-cliente.model";
import FormInputNumber from "../../../../components/FormInputNumber";

const handleSubmitRegisterSchema = z.object({
  nome: z
    .string()
    .min(1, {
      message: fieldRequired("nome"),
    }),
  qtdMinViagens: z
    .number()
    .min(0, {
      message: fieldRequired('Mínimo de viagens')
    }),
  qtdMaxViagens: z
    .number()
    .min(0, {
      message: fieldRequired('Máximo de viagens')
    })
});

type IhandleSubmitRegister = z.infer<typeof handleSubmitRegisterSchema>;

interface IModalUpdateContaBancaria {
  handleClose: () => void
  data: IRankingCliente
}

const ModalUpdateContaBancaria = ({
  handleClose,
  data
}: IModalUpdateContaBancaria) => {
  const { user } = useGlobal();
  const { updateRankingCliente } = useRankingCliente();

  const {
    getValues,
    setValue,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IhandleSubmitRegister>({
    resolver: zodResolver(handleSubmitRegisterSchema),
    defaultValues: {
      nome: data.nome,
      qtdMinViagens: data.qtdMinViagens,
      qtdMaxViagens: data.qtdMaxViagens
    }
  });
  const { mutate, isLoading } = updateRankingCliente(reset, handleClose);

  const handleSubmitRegister = (submitData: IhandleSubmitRegister) => {
    mutate({
      ...submitData,
      id: data.id,
      usuariosId: user?.id
    })
  };

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

        <Flex
          gap="15px"
          flexDirection={{
            base: "column",
            lg: "row",
          }}
        >
          <FormInputNumber
            height="40px"
            label="Mínimo de Viagens"
            minWidth="200px"
            {...register("qtdMinViagens")}
            setValue={setValue}
            flex="1.01"
            name="qtdMinViagens"
            maxLength={25}
            isRequired
            dontAllowNegative
            value={getValues('qtdMinViagens')}
            errors={errors.qtdMinViagens}
          />

          <FormInputNumber
            height="40px"
            label="Máximo de Viagens"
            minWidth="200px"
            {...register("qtdMaxViagens")}
            setValue={setValue}
            flex="1.01"
            name="qtdMaxViagens"
            maxLength={25}
            value={getValues('qtdMaxViagens')}
            isRequired
            dontAllowNegative
            errors={errors.qtdMaxViagens}
          />
        </Flex>
        <br />

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

export default ModalUpdateContaBancaria;
