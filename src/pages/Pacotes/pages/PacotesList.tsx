import { Button, Flex, TableContainer } from "@chakra-ui/react";
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
import ModalRecordPacote from "../components/ModalRegisterPacote";
import AlertNoDataFound from "../../../components/AlertNoDataFound";
import useProduct from "../../../hooks/useProducts";
import { MdEdit } from "react-icons/md";
import ModalUpdatePacote from "../components/ModalUpdatePacote";
import { IDataProduct } from "../../../models/product2.model";
import ButtonIcon from "../../../components/ButtonIcon";
import { FiTrash } from "react-icons/fi";
import AlertModal from "../../../components/AlertModal";

const PacotesList = () => {
  const { getProducts } = useProduct();
  const [statusSelected, setStatusSelected] = useState<ISelect | null>();
  const [resetFilter, setResetFilter] = useState(false);
  const [modalRecordPacote, setModalRecordPacote] = useState(false);
  const [modalUpdatePacote, setModalUpdatePacote] = useState(false);
  const [modalRemovePacote, setModalRemovePacote] = useState(false);
  const [pacoteData, setPacoteData] = useState<IDataProduct | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const registerPerPage = 10;

  const { data, count, isLoading } = getProducts({
    size: registerPerPage,
    page: currentPage
  });

  return (
    <>
      <SectionTop className="contentTop">
        <Button
          leftIcon={<IoIosAdd />}
          onClick={() => {
            setModalRecordPacote(true);
          }}
        >
          Cadastrar pacote
        </Button>
      </SectionTop>

      <Content className="contentMain">
        <Flex width="100%" gap="15px" alignItems="flex-end" flexWrap="wrap">
          <div className="searchWrap">
            <span>Buscar pacote</span>
            <FieldSearch
              placeholder="Nome ou CPF"
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
                      <TD>Origem</TD>
                      <TD>Destino</TD>
                      <TD>Status</TD>
                      <TD></TD>
                    </THead>

                    <TBody>
                      {data.map((item) => (
                        <TR key={item.id}>
                          <TD>
                            {item.nome}
                          </TD>
                          <TD>
                            {item.estoque}
                          </TD>
                          <TD>
                            {item.Fornecedor.nome}
                          </TD>
                          <TD>
                            {item.ativo ? "Ativo" : "Inativo"}
                          </TD>
                          <TD gap={3}>
                            <MdEdit
                              size={20}
                              // color={customTheme.colors.brandSecond.first}
                              cursor="pointer"
                              onClick={() => {
                                setPacoteData(item)
                                setModalUpdatePacote(true)
                              }}
                            />

                            <ButtonIcon tooltip="Excluir Pacote">
                              <Button
                                variant="unstyled"
                                display="flex"
                                alignItems="center"
                                colorScheme="red"
                                onClick={() => setModalRemovePacote(true)}
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
              <AlertNoDataFound title="Nenhum pacote encontrado" />
            )}
          </>
        )}
      </Content>

      <SimpleModal
        title="Pacote"
        size="xl"
        isOpen={modalRecordPacote}
        handleModal={setModalRecordPacote}
      >
        <ModalRecordPacote
          handleClose={() => setModalRecordPacote(false)}
        />
      </SimpleModal>

      {pacoteData && (
        <SimpleModal
          title="Pacote"
          size="xl"
          isOpen={modalUpdatePacote}
          handleModal={setModalUpdatePacote}
        >
          <ModalUpdatePacote
            handleClose={() => setModalUpdatePacote(false)}
            // data={pacoteData}
          />
        </SimpleModal>
      )}

      {modalRemovePacote && (
        <AlertModal
          title="Remover Pacote"
          question="Deseja realmente remover este pacote?"
          request={() => {}}
          showModal={modalRemovePacote}
          setShowModal={setModalRemovePacote}
          size="md"
        ></AlertModal>
      )}
    </>
  );
};

export default PacotesList;