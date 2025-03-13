const Pagination = ({currentPage,totalPages,onPageChange})=>{

    const pageNumbers = [];
    for(let index = 1;index < totalPages; index++){
        for(let i=1;i<totaoPages;i++){
            pageNumbers.push(i);
        }
        return(
            <div className="pagination">
                {pageNumbers.map((number)=>(
                    <button 
                        key={number}
                        onclick={()=>onPageChange(number)}
                        className={number===currentPage?'active':''}
                        >{number}
                        </button>
                ))}
            </div>
        )
    }
}
export default Pagination;