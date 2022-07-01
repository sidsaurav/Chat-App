import { Badge } from '@chakra-ui/layout'

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius='lg'
            m={1}
            mb={2}
            variant='solid'
            fontSize={12}
            colorScheme='purple'
            cursor='pointer'
            onClick={handleFunction}
        >
            {user.name} {admin === user._id && <span> (Admin)</span>}
            <i class='fa fa-window-close' aria-hidden='true'></i>
        </Badge>
    )
}

export default UserBadgeItem
