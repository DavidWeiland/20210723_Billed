import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import firebase from "../__mocks__/firebase"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Bills from "../containers/Bills.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      //const dates = screen.getAllByText(/^((19|20)\d\d)[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      // code à ajouter pour tester date au format JJ MMM AA si mise en forme dans BillsUI (!= Bills) :
      const dates = screen.getAllByText(/^((19|20)\d\d)|(\d{1,2})[- /.](0[1-9]|1[012])|(Jan.|Fév.|Mar.|Avr.|Mai|Jui.|Aoû.|Sep.|Oct.|Nov.|Déc.)[- /.](0[1-9]|[12][0-9]|3[01])|(\d{2})$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe('When I am on Bills page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })

  describe('When I am on Bills page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      const html = BillsUI({ error: 'some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
})

//Test container/Bills.js
describe('Given I am connected as an Employee', () => {
  describe('When I am on Bills page and I click on NewBill button', () => {
    test('Then, handleClickNewBill() is called', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const constructorBills = new Bills({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      document.body.innerHTML = BillsUI({ data: [] })
      const handleClickNewBill = jest.fn(constructorBills.handleClickNewBill)
      const btnNewBill = screen.getByTestId('btn-new-bill')
      btnNewBill.addEventListener('click', handleClickNewBill)
      userEvent.click(btnNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      
    })
    test('Then, NewBill page is open', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const constructorBills = new Bills({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      document.body.innerHTML = BillsUI({ data: [] })
      const handleClickNewBill = jest.fn(constructorBills.handleClickNewBill)
      const btnNewBill = screen.getByTestId('btn-new-bill')
      btnNewBill.addEventListener('click', handleClickNewBill)
      
      userEvent.click(btnNewBill)
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
  })

  describe('When I am on Bills page and I click on icon Eye', () => {
    test('Then, handleClickIconEye() is called', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const constructorBills = new Bills({
        document, onNavigate, firestore:null, localStorage: window.localStorage
      })
      const handleClickIconEye = jest.fn(constructorBills.handleClickIconEye)
      const iconEye = screen.getAllByTestId('icon-eye')
      let index = 0
      iconEye.forEach(icon => {
        icon.addEventListener('click', handleClickIconEye(icon))
        index++
        userEvent.click(icon)
        expect(handleClickIconEye).toHaveBeenCalledTimes(index)
        expect(handleClickIconEye).toHaveBeenCalled()
      })
      userEvent.click(iconEye[0])
      userEvent.click(iconEye[1])
      userEvent.click(iconEye[2])
      userEvent.click(iconEye[3])
      expect(handleClickIconEye).toHaveBeenCalled()
      expect(handleClickIconEye).toHaveBeenCalledTimes(4)
    })
    test('Then, modale is open', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const constructorBills = new Bills({
        document, onNavigate, firestore:null, localStorage: window.localStorage
      })
      const handleClickIconEye = jest.fn(constructorBills.handleClickIconEye)
      const iconEye = screen.getAllByTestId('icon-eye')
      iconEye.forEach(icon => {
        icon.addEventListener('click', handleClickIconEye(icon))
      })
      userEvent.click(iconEye[0])
      expect(screen.getByText('Justificatif')).toBeTruthy()
    })
  })

  describe('When I am on Bills page', () => {
    test('Then, charging data launch getBills', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const constructorBills = new Bills({
        document, onNavigate, firestore:null, localStorage: window.localStorage
      })
      const getBills = jest.fn(constructorBills.getBills)
      getBills()
      expect(getBills).toHaveBeenCalled()
    })
  })
})


describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to bills", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const billss = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(billss.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
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