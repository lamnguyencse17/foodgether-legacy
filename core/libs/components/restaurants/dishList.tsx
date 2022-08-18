import {
  Box,
  Grid,
  GridItem,
  Stack,
  Text,
  Link as ChakraLink,
  List,
  ListItem,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { GetRestaurantResult } from '../../../pages/restaurants/[id]'

type RestaurantDishListProps = {
  restaurant: NonNullable<GetRestaurantResult>
}

const RestaurantDishList = ({ restaurant }: RestaurantDishListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const menu = restaurant.menu
  //   const handleOptionClick = ()
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>hahah</div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Grid templateColumns="repeat(4, 1fr)" h="fit-content" gap={10}>
        <GridItem
          colSpan={1}
          border="1px"
          borderColor="orange.200"
          height="fit-content"
        >
          <Stack>
            {menu.dishTypes?.map((dishType) => (
              <Box id={`${dishType.id}-header`} key={dishType.id}>
                <Text fontSize="lg" paddingLeft="1">
                  <Link href={`#${dishType.id}`}>
                    <ChakraLink>{dishType.name}</ChakraLink>
                  </Link>
                </Text>
              </Box>
            ))}
          </Stack>
        </GridItem>
        <GridItem colSpan={3} border="1px" borderColor="orange.200">
          {menu.dishTypes?.map((dishType) => (
            <Stack
              id={dishType.id.toString()}
              marginBottom="8"
              key={dishType.id}
            >
              <Text
                fontSize="2xl"
                paddingLeft="1"
                fontWeight="bold"
                color="orange.600"
              >
                {dishType.name}
              </Text>
              <List spacing={3}>
                {dishType.dishes.map((dish) => {
                  const dishPhoto = dish.photos[dish.photos.length - 1]
                  return (
                    <ListItem id={dish.id.toString()} key={dish.id}>
                      <Grid
                        templateColumns="repeat(6, 1fr)"
                        h="fit-content"
                        gap={2}
                        padding={5}
                      >
                        <GridItem colSpan={[5, null, 1]}>
                          <Image
                            src={dishPhoto.value}
                            width={dishPhoto.width}
                            height={dishPhoto.height}
                            alt={dish.name}
                          />
                        </GridItem>
                        <GridItem colSpan={[5, null, 4]}>
                          <ChakraLink onClick={() => onOpen()}>
                            <Text fontSize="lg" fontWeight="semibold">
                              {dish.name}
                            </Text>
                          </ChakraLink>

                          <Text fontSize="md">{dish.description}</Text>
                        </GridItem>
                        <GridItem colSpan={[5, null, 1]}>
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="orange.500"
                          >
                            {dish.discountPrice
                              ? dish.discountPrice.text
                              : dish.price.text}
                          </Text>
                        </GridItem>
                      </Grid>
                      <Divider borderColor="orange.200" />
                    </ListItem>
                  )
                })}
              </List>
            </Stack>
          ))}
        </GridItem>
      </Grid>
    </>
  )
}

export default RestaurantDishList
