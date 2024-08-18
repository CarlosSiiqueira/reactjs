import { Button, Flex, TableContainer, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import FieldSearch from "../../../components/FieldSearch";
import Loading from "../../../components/Loading";
import Pagination from "../../../components/Pagination";
import { TBody, TD, THead, TR, Table } from "../../../components/Table";

// Styled Components
import { Content, SectionTop } from "./styled";

// Hooks and utils
import ReactSelect from "react-select";
import SimpleModal from "../../../components/SimpleModal";
import { ISelect } from "../../../models/generics.model";
import ModalRegisterCliente from "../components/ModalRegisterCliente";
import ModalUpdateCliente from "../components/ModalUpdateCliente";
import AlertNoDataFound from "../../../components/AlertNoDataFound";
import { MdEdit } from "react-icons/md";
import ButtonIcon from "../../../components/ButtonIcon";
import { FiTrash } from "react-icons/fi";
import AlertModal from "../../../components/AlertModal";
import usePessoas from "../../../hooks/usePessoas";
import { IPessoa } from "../../../models/pessoa.model";
import { cpfMask } from "../../../utils";

const ClienteList = () => {
    const { getPessoas, deletePessoa } = usePessoas();
    const [statusSelected, setStatusSelected] = useState<ISelect | null>();
    const [resetFilter, setResetFilter] = useState(false);
    const [modalRegisterCliente, setModalRegisterCliente] = useState(false);
    const [modalUpdateCliente, setModalUpdateCliente] = useState(false);
    const [modalRemoveCliente, setModalRemoveCliente] = useState(false);
    const [clienteData, setClienteData] = useState<IPessoa | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const registerPerPage = 10;

    const { mutate: mutateToDeleteCliente } = deletePessoa();
    const [deleteItemId, setDeleteClienteId] = useState('');

    const { data, count, isLoading } = getPessoas({
        size: registerPerPage,
        page: currentPage
    });

    const onConfirmRemoveCliente = () => {
        mutateToDeleteCliente(deleteItemId || "");
        setModalRemoveCliente(false);
    };

    return (
        <>
            <Flex>
                <SectionTop className="contentTop" gap="30px">
                    <Flex gap="10px" flexWrap="wrap">
                        <Text fontSize="2xl" fontWeight="bold">
                            Clientes
                        </Text>
                    </Flex>
                </SectionTop>

                <SectionTop className="contentTop">
                    <Button
                        leftIcon={<IoIosAdd />}
                        onClick={() => {
                            setModalRegisterCliente(true);
                        }}
                    >
                        Cadastrar Cliente
                    </Button>
                </SectionTop>
            </Flex>

            <Content className="contentMain">
                <Flex width="100%" gap="15px" alignItems="flex-end" flexWrap="wrap">
                    <div className="searchWrap">
                        <span>Buscar Cliente</span>
                        <FieldSearch
                            placeholder="Nome/E-mail"
                            handleSearch={() => {
                                setResetFilter(false);
                                setCurrentPage(1);
                            }}
                            reset={resetFilter}
                        />
                    </div>
                    <Flex flexDirection="column" gap="5px" width="300px">
                        <span>Status</span>

                        <ReactSelect
                            className="select-fields"
                            classNamePrefix="select"
                            closeMenuOnSelect={true}
                            isSearchable={true}
                            value={statusSelected}
                            placeholder="Selecionar"
                            noOptionsMessage={() => "Nenhum Status encontrado"}
                            onChange={(item) => {
                                setStatusSelected(item);
                            }}
                            options={[
                                {
                                    label: "Completo",
                                    value: 1,
                                },
                                {
                                    label: "Incompleto",
                                    value: 2,
                                },
                            ]}
                        />
                    </Flex>
                    <Button
                        borderRadius="5px"
                        variant="outline"
                        onClick={() => {
                            setResetFilter(true);
                            setStatusSelected(null);
                        }}
                    >
                        Limpar Filtros
                    </Button>
                </Flex>

                {isLoading && (
                    <Flex h="100%" alignItems="center">
                        <Loading />
                    </Flex>
                )}

                {!isLoading && (
                    <>
                        {data.length > 0 && (
                            <>
                                <TableContainer marginBottom="10px">
                                    <Table>
                                        <THead padding="0 30px 0 30px">
                                            <TD>Nome</TD>
                                            <TD>CPF</TD>
                                            <TD>E-Mail</TD>
                                            <TD>Ativo</TD>
                                            <TD>Ranking</TD>
                                            <TD></TD>
                                        </THead>

                                        <TBody>
                                            {data.map((item) => (
                                                <TR key={item.id}>
                                                    <TD>
                                                        {item.nome}
                                                    </TD>
                                                    <TD>
                                                        {cpfMask(item.cpf)}
                                                    </TD>
                                                    <TD>
                                                        {item.email}
                                                    </TD>
                                                    <TD>
                                                        {item.ativo ? 'Ativo' : 'Inativo'}
                                                    </TD>
                                                    <TD>
                                                        {item.Ranking?.nome}
                                                    </TD>
                                                    <TD gap={3}>
                                                        <MdEdit
                                                            size={20}
                                                            // color={customTheme.colors.brandSecond.first}
                                                            cursor="pointer"
                                                            onClick={() => {
                                                                setClienteData(item)
                                                                setModalUpdateCliente(true)
                                                            }}
                                                        />

                                                        <ButtonIcon tooltip="Excluir Cliente">
                                                            <Button
                                                                variant="unstyled"
                                                                display="flex"
                                                                alignItems="center"
                                                                colorScheme="red"
                                                                onClick={() => {
                                                                    setModalRemoveCliente(true)
                                                                    setDeleteClienteId(item.id)
                                                                }}
                                                            >
                                                                <FiTrash />
                                                            </Button>
                                                        </ButtonIcon>
                                                    </TD>
                                                </TR>
                                            ))}
                                        </TBody>
                                    </Table>
                                </TableContainer>

                                <Pagination
                                    registerPerPage={registerPerPage}
                                    totalRegisters={count}
                                    currentPage={currentPage}
                                    handleChangePage={(page) => setCurrentPage(page)}
                                />
                            </>
                        )}

                        {data.length === 0 && (
                            <AlertNoDataFound title="Nenhuma cliente encontrado" />
                        )}
                    </>
                )}
            </Content>

            <SimpleModal
                title="Cliente"
                size="xl"
                isOpen={modalRegisterCliente}
                handleModal={setModalRegisterCliente}
            >
                <ModalRegisterCliente
                    handleClose={() => setModalRegisterCliente(false)}
                />
            </SimpleModal>

            {clienteData && (
                <SimpleModal
                    title="Cliente"
                    size="xl"
                    isOpen={modalUpdateCliente}
                    handleModal={setModalUpdateCliente}
                >
                    <ModalUpdateCliente
                        handleClose={() => setModalUpdateCliente(false)}
                        data={clienteData}
                    />
                </SimpleModal>
            )}

            {modalRemoveCliente && (
                <AlertModal
                    title="Remover Cliente"
                    question="Deseja realmente remover esse cliente?"
                    request={onConfirmRemoveCliente}
                    showModal={modalRemoveCliente}
                    setShowModal={setModalRemoveCliente}
                    size="md"
                ></AlertModal>
            )}
        </>
    );
};

export default ClienteList;
