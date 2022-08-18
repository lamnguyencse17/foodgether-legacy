import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Highlight,
} from '@chakra-ui/react'
import { Dish } from './restaurantInfo'

type OptionModalProps = {
  dish: Dish | null
  isOpen: boolean
  handleCloseOption: () => void
}

const OptionModal = ({ dish, isOpen, handleCloseOption }: OptionModalProps) => {
  return (
    <Modal isOpen={isOpen && !!dish} onClose={handleCloseOption}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{dish?.name} options</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Max</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dish?.options.flatMap((option) => [
                <Tr>{option.name}</Tr>,
                option.optionItems.items.map((item) => (
                  <Tr>
                    <Td>
                      {item.isDefault ? (
                        <Highlight
                          query={item.name}
                          styles={{ px: '1', py: '1', bg: 'orange.100' }}
                        >
                          {item.name}
                        </Highlight>
                      ) : (
                        item.name
                      )}
                    </Td>
                    <Td isNumeric>{item.price.text}</Td>
                    <Td isNumeric>{item.maxQuantity}</Td>
                  </Tr>
                )),
              ])}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default OptionModal
