export const readableDate = (date:string) => {
    const dateObject = new Date(date);

    return `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;
}

export const inputDate = (dateObject:Date) => {
    return `${dateObject.getFullYear()}-${String(dateObject.getMonth() + 1).padStart(2, '0')}-${String(dateObject.getDate()).padStart(2, '0')}`;
}