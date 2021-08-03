import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"
//import { formatDate} from "../app/format.js" //à mettre ici + L12 ? voir avec mentor mis en forme de la date après le tri mais nouvelle erreur au terminal = modification regex du test ?
import Actions from './Actions.js'

const row = (bill) => {
  
  //((/^((19|20)\d\d)[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).test(bill.date)) ? bill.date = formatDate(bill.date) : bill.date = `Error Format Date : ${bill.date}`
  
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
  }
  
  const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}

export default ({ data: bills, loading, error }) => {
  
  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }

  const modal = () => (`
  <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
  <div class="modal-content">
  <div class="modal-header">
  <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
  <span aria-hidden="true">&times;</span>
  </button>
  </div>
  <div class="modal-body">
  </div>
  </div>
  </div>
  </div>
  `)
  

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills.sort((a, b) => (a.date < b.date) ? 1 : -1))}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}