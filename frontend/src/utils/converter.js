import { STATUS } from './enums';
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
        default:
            return colors.editColor
    }
}