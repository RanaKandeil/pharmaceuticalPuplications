export interface SearchFiltre{
    country_id: number|null ,
    category_id: number|null,
    subcat_id:number|null,
    file_name?: number,
    year?: number,
    doc_no?: number,
    txt?:string,
}