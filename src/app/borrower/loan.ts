export class Loan {
  public loanId: number;
  public bookId: number;
  public branchId: number;
  public cardNo: number;
  public dateOut: string;
  public dueDate: string;
  public imageUrl: string;

  constructor(    
    loanId: number,
    bookId: number,
    branchId: number,
    cardNo: number,
    dateOut: string,
    dueDate: string
  ) {
    console.log("new loan", loanId)
    this.loanId = loanId;
    this.bookId = bookId;
    this.branchId = branchId;
    this.cardNo = cardNo;
    this.dateOut = dateOut.slice(0,10);
    this.dueDate = dueDate.slice(0,10);
    this.imageUrl = `https://picsum.photos/id/${
      this.bookId + 300
    }/200/125`;
  }
}
