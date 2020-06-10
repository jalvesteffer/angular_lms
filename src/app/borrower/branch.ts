export class Branch {
    public branchId: number;
    public branchName: string;
    public branchAddress: string;

    constructor(branchId: number, branchName: string, branchAddress: string){
        this.branchId = branchId;
        this.branchName = branchName;
        this.branchAddress = branchAddress;
    }
}
