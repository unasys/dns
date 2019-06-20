export function convertFileType(type) {
    if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return "docx";
    } else if (type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        return "xlsx";
    } else if (type === "application/vnd.ms-excel") {
        return "csv";
    }
    return type.split("/")[1];
}