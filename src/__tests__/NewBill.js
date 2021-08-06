import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import '@testing-library/jest-dom/extend-expect'
import { localStorageMock } from "../__mocks__/localStorage.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"

const bills = [{
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
      document.body.innerHTML = NewBillUI({ bills })
      const newBill = new NewBill({ document, onNavigate, firestore, localStorage })
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
  
      const file = screen.getByTestId('file')
      file.addEventListener('change', handleChangeFile)
      userEvent.change(file.value)
      expect(handleChangeFile).toHaveBeenCalled()
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
      document.body.innerHTML = NewBillUI({ bills })
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