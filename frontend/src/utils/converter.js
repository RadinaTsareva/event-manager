import { ROLES, STATUS } from './enums';
import colors from '../sharedStyles/shared.module.scss';

export const convertToDate = (date) => {
    return new Date(date).toISOString().split('T')[0]
}

export const convertColorByStatus = (status) => {
    switch (status) {
        case STATUS.ACCEPTED:
            return colors.acceptColor
        case STATUS.REJECTED:
            return colors.rejectColor
        case STATUS.PENDING:
        case STATUS.EDIT_PENDING:
            return colors.pendingColor
        case STATUS.FINISHED:
            return colors.secondaryColor
        default:
            return colors.editColor
    }
}

export const getStatusOrderByRole = (role) => {
    if (role === ROLES.CLIENT) {
        return [STATUS.EDITABLE, STATUS.FINISHED, STATUS.ACCEPTED, STATUS.REJECTED, STATUS.PENDING, STATUS.EDIT_PENDING]
    }

    return [STATUS.EDIT_PENDING, STATUS.PENDING, STATUS.FINISHED, STATUS.ACCEPTED, STATUS.REJECTED, STATUS.EDITABLE]
}
