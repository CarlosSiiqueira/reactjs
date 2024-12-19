import { Button, Flex, TableContainer, Tooltip, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosAdd, IoMdClose } from "react-icons/io";
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
import ModalRegisterReservas from "../components/ModalRegisterReservas";
import ModalUpdateReservas from "../components/ModalUpdateReservas";
import AlertNoDataFound from "../../../components/AlertNoDataFound";
import { MdEdit, MdInsertLink } from "react-icons/md";
import ButtonIcon from "../../../components/ButtonIcon";
import AlertModal from "../../../components/AlertModal";
import useReservas from "../../../hooks/useReservas";
import { IReserva } from "../../../models/reservas.model";
import { IoTicket } from "react-icons/io5";
import { MdOutgoingMail } from "react-icons/md";
import { formattingDate } from "../../../utils/formattingDate";
import { FaShoppingCart } from "react-icons/fa";
import { GrSystem } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import ModalRegisterCredito from "../components/ModalRegisterCredito";
import ModalRegisterLink from "../components/ModalRegisterLink"

const ReservasList = () => {
  const { getReserva, deleteReserva, sendTicketMail } = useReservas();
  const [statusSelected, setStatusSelected] = useState<ISelect | null>();
  const [resetFilter, setResetFilter] = useState(false);
  const [modalRegisterReserva, setModalRegisterReserva] = useState(false);
  const [modalGenerateLink, setModalGenerateLink] = useState(false);
  const [modalUpdateReserva, setModalUpdateReserva] = useState(false);
  const [modalRemoveReserva, setModalRemoveReserva] = useState(false);
  const [modalRegisterCredito, setModalRegisterCredito] = useState(false);
  const [valorPacote, setvalorPacote] = useState(0)
  const [creditoData, setCreditoData] = useState<IReserva>();
  const [reservaData, setReservaData] = useState<IReserva | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [nome, setNome] = useState('')

  const registerPerPage = 10;
  const navigate = useNavigate()

  const { mutate: mutateToDeleteReserva } = deleteReserva();
  const { mutate: mutateToSendEmail, isLoading: isLoadingEmail } = sendTicketMail();
  const [deleteItemId, setDeleteReservaId] = useState('');

  const { data, count, isLoading } = getReserva({
    size: registerPerPage,
    page: currentPage,
    status: statusSelected?.value,
    filter: nome
  });

  const onConfirmRemoveReserva = () => {
    mutateToDeleteReserva(deleteItemId || "");
    setModalRemoveReserva(false);
  };

  return (
    <>
      <Flex>
        <SectionTop className="contentTop" gap="30px">
          <Flex gap="10px" flexWrap="wrap">
            <Text fontSize="2xl" fontWeight="bold">
              Reservas
            </Text>
          </Flex>
        </SectionTop>

        <SectionTop className="contentTop">
          <Flex gap="10px" flexWrap="wrap">
            <Button
              leftIcon={<MdInsertLink />}
              onClick={() => {
                setModalGenerateLink(true);
              }}
            >
              Gerar Link
            </Button>
            <Button
              leftIcon={<IoIosAdd />}
              onClick={() => {
                setModalRegisterReserva(true);
              }}
            >
              Cadastrar Reserva
            </Button>
          </Flex>
        </SectionTop>
      </Flex>
      <Content className="contentMain">
        <Flex width="100%" gap="15px" alignItems="flex-end" flexWrap="wrap">
          <div className="searchWrap">
            <span>Buscar Reserva</span>
            <FieldSearch
              placeholder="Nome"
              handleSearch={(event) => {
                setResetFilter(false);
                setCurrentPage(1);
                setNome(event)
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
                  label: 'Todos',
                  value: 'all'
                },
                {
                  label: "Pendente",
                  value: 0,
                },
                {
                  label: "Efetivado",
                  value: 1,
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
                      <TD>Situação</TD>
                      <TD>Reseva</TD>
                      <TD>Vouchers</TD>
                      <TD>Detalhes</TD>
                      <TD>Excursão</TD>
                      <TD>Data / Hora</TD>
                      <TD></TD>
                    </THead>

                    <TBody>
                      {data.map((item) => (
                        <TR key={item.id}>
                          <TD>
                            {item.status ? (
                              <Tooltip label="Efetivado" placement="top" hasArrow>
                                <div style={{
                                  backgroundColor: "green",
                                  borderRadius: "50%",
                                  width: "10px",
                                  height: "10px"
                                }} />
                              </Tooltip>
                            ) : (
                              <Tooltip label="Pendente" placement="top" hasArrow>
                                <div style={{
                                  backgroundColor: "red",
                                  borderRadius: "50%",
                                  width: "10px",
                                  height: "10px"
                                }} />
                              </Tooltip>
                            )}
                          </TD>
                          <TD>
                            {item.reserva}
                          </TD>
                          <TD>
                            {item.Pessoa?.length}
                          </TD>
                          <TD>
                            {item.plataforma == 1 ? (
                              <ButtonIcon tooltip="Loja">
                                <FaShoppingCart />
                              </ButtonIcon>

                            ) : (
                              <ButtonIcon tooltip={`Sistema Por: ${item.Usuario.nome}`}>
                                <GrSystem />
                              </ButtonIcon>
                            )}
                          </TD>
                          <TD>
                            {item.Excursao?.nome}
                          </TD>
                          <TD>
                            {formattingDate(item.dataCadastro, true)}
                          </TD>
                          <TD gap={3}>

                            {!item.status && (
                              <ButtonIcon tooltip="Editar">
                                <MdEdit
                                  size={20}
                                  cursor="pointer"
                                  onClick={() => {
                                    setReservaData(item)
                                    setModalUpdateReserva(true)
                                  }}
                                />
                              </ButtonIcon>
                            )}

                            <ButtonIcon tooltip="Ver Reserva">
                              <IoTicket
                                size={20}
                                onClick={() => { navigate(`/reservas/${item.id}/voucher`) }}
                              />
                            </ButtonIcon>

                            <ButtonIcon tooltip="Enviar E-mail com voucher">
                              <MdOutgoingMail
                                size={20}
                                onClick={() => {
                                  if (!isLoadingEmail) {
                                    mutateToSendEmail(item.id)
                                  }
                                }}
                              />
                            </ButtonIcon>

                            <ButtonIcon tooltip="Cancelar reserva">
                              <IoMdClose
                                size={20}
                                onClick={() => {
                                  if (item.status) {
                                    setCreditoData(item)
                                    setvalorPacote((item.Excursao.valor - item.desconto) * item.Pessoa.length)
                                    setModalRegisterCredito(true)
                                  } else {
                                    setDeleteReservaId(item.id)
                                    setModalRemoveReserva(true)
                                  }
                                }}
                              />
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
              <AlertNoDataFound title="Nenhuma reserva encontrada" />
            )}
          </>
        )}
      </Content>

      <SimpleModal
        title="Reserva"
        size="xl"
        isOpen={modalRegisterReserva}
        handleModal={setModalRegisterReserva}
      >
        <ModalRegisterReservas
          handleClose={() => setModalRegisterReserva(false)}
        />
      </SimpleModal>

      {reservaData && (
        <SimpleModal
          title="Reserva"
          size="xl"
          isOpen={modalUpdateReserva}
          handleModal={setModalUpdateReserva}
        >
          <ModalUpdateReservas
            handleClose={() => setModalUpdateReserva(false)}
            data={reservaData}
          />
        </SimpleModal>
      )}

      {modalRegisterCredito && creditoData && (
        <SimpleModal
          title="Gerar Crédito"
          size="xl"
          isOpen={modalRegisterCredito}
          handleModal={setModalRegisterCredito}
        >
          <ModalRegisterCredito
            handleClose={() => setModalRegisterCredito(false)}
            valorPacote={valorPacote}
            data={creditoData}
          />
        </SimpleModal>
      )}

      {modalRemoveReserva && (
        <AlertModal
          title="Cancelar Reserva"
          question="Deseja realmente cancelar essa reserva?"
          request={onConfirmRemoveReserva}
          showModal={modalRemoveReserva}
          setShowModal={setModalRemoveReserva}
          size="md"
        ></AlertModal>
      )}

      <SimpleModal
        title="Link Pagarme"
        size="xl"
        isOpen={modalGenerateLink}
        handleModal={setModalGenerateLink}
      >
        <ModalRegisterLink
          handleClose={() => setModalGenerateLink(false)}
        />
      </SimpleModal>
    </>
  );
};

export default ReservasList;
