import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) { buttonNewBill.addEventListener('click', this.handleClickNewBill) } else { `` }
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye.length>=1) {
      iconEye.forEach(icon => {
        icon.addEventListener('click', (e) => this.handleClickIconEye(icon))
      })
    } else {
      ``
    }
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = e => {
    console.log(`ouverture formulaire NewBill`)
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    console.log(`ouverture modale justificatif`)
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} /></div>`)
    if (typeof $('#modaleFile').modal === 'function') { $('#modaleFile').modal('show') } else {``}
  }

  // not need to cover this function by tests
  getBills = () => {
    const userEmail = localStorage.getItem('user') ?
      JSON.parse(localStorage.getItem('user')).email : ""
    console.log(`Chargement des notes de frais de ${userEmail}`)
    if (this.firestore) {
      return this.firestore
      .bills()
      .get()
      .then(snapshot => {
        const bills = snapshot.docs
          .map(doc => ({
            //try {
              //return {
                //...doc.data(),
                //date: formatDate(doc.data().date),//test pour formatDate
                //date: doc.data().date,// format conservé pour tri
                //status: formatStatus(doc.data().status)
              //}
            //} catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function, log the error and return unformatted date in that case
              //console.log(e,'for',doc.data())
              //return {
                ...doc.data(),
                date: doc.data().date,
                status: formatStatus(doc.data().status)
              //}
            //}
          }))
          .filter(bill => bill.email === userEmail)
          //console.log('length', bills.length)
        return bills
      })
      .catch(error => error)
    } else {
      console.log(`absence de données`)
      this.onNavigate(ROUTES_PATH['login'])
    }
  }
}