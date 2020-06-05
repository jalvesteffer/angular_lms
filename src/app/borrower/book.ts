export class Book {
  public bookId: number;
  public branchId: number;
  public noOfCopies: number;
  public title: string;
  public imageUrl: string;

  constructor(
    bookId: number,
    branchId: number,
    noOfCopies: number,
    title: string
  ) {
    this.bookId = bookId;
    this.branchId = branchId;
    this.noOfCopies = noOfCopies;
    this.title = title;
    this.imageUrl = `https://picsum.photos/id/${
      Math.floor(Math.random() * 90) + 1001
    }/200/125`;
  }
}
