import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import '@testing-library/jest-dom/extend-expect'
import { localStorageMock } from "../__mocks__/localStorage.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"
import firebase from "../__mocks__/firebase"
import BillsUI from "../views/BillsUI.js"

const bill = [{
  "id": "47qAXb6fIm2zOKkLzMro",
  "vat": "80",
  "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  "status": "pending",
  "type": "Hôtel et logement",
  "commentary": "séminaire billed",
  "name": "encore",
  "fileName": "preview-facture-free-201801-pdf-1.jpg",
  "date": "2004-04-04",
  "amount": 400,
  "commentAdmin": "ok",
  "email": "a@a",
  "pct": 20,
  "email": "john.snow@billed.com"
}]


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })

  describe('When I select a file in form NewBill', () => {
    test(('Then, upload file'), () => {
      const fileTest1 = new File(['png'], 'png.png', { type: 'image/png' })
      const fileTest2 = new File(['pdf'], 'pdf.pdf', { type: 'application/pdf' })
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const firestore = null

      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({ document, onNavigate, firestore, localStorage })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const input = screen.getByTestId('file')
      input.addEventListener('change', handleChangeFile)
      
      userEvent.upload(input, fileTest1)
      expect(input.files[0]).toStrictEqual(fileTest1)
      
      userEvent.upload(input, fileTest2)
      expect(handleChangeFile).toHaveBeenCalled()
      expect(input.files[0]).toStrictEqual(fileTest2)
    })
  })

  describe('When I click on submit button', () => {
    test(('Then, I should be sent to Bills Page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const firestore = null
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({ document, onNavigate, firestore, localStorage })
      const handleSubmit = jest.fn(newBill.handleSubmit)
  
      const formNewBill = screen.getByTestId('form-new-bill')
      formNewBill.addEventListener('click', handleSubmit)
      userEvent.click(formNewBill)
  
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByText('Mes notes de frais')).toBeTruthy()
    })
  })
})

// à travailler encore
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to NewBill", () => {
    test("fetches bill to mock API POST", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const firestore = null
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({ document, onNavigate, firestore, localStorage })
      
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      const createBill = jest.fn(newBill.createBill)
      createBill(bill)
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })

    test("fetches bill to an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

