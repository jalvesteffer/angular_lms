// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appUrl: 'http://localhost:3000/lms/admin',
  libraryUrl: 'http://localhost:3000/lms/library',
  createAuthorsURI: '/authors',
  createGenresURI: '/genres',
  readAuthorsURI: '/authors',
  readBooksURI: '/books',
  readPublishersURI: '/publishers',
  readGenresURI: '/genres',
  readBorrowersURI: '/borrowers',
  readBranchesURI: '/branches',
  readBookCopiesURI: '/bookcopies',
  deleteAuthorsURI: '/authors',
  deleteBooksURI: '/books',
  deletePublishersURI: '/publishers',
  deleteGenresURI: '/genres',
  deleteBorrowersURI: '/borrowers',
  deleteBranchesURI: '/branches',
  deleteBookCopiesURI: '/bookcopies',
  updateAuthorsURI: '/authors',
  updateBooksURI: '/books',
  updatePublishersURI: '/publishers',
  updateGenresURI: '/genres',
  updateBorrowersURI: '/borrowers',
  updateBranchesURI: '/branches',
  updateLibraryBranchesURI: '/branches/branch',
  updateBookCopiesURI: '/bookcopies'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
