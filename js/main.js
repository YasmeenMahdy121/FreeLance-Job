import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import {getFirestore, onSnapshot, collection, doc, addDoc, setDoc,query,where,getDocs} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDNsjynvfjurb26aw9j_5uXxsUm0zPJOpo",
  authDomain: "school-4e452.firebaseapp.com",
  projectId: "school-4e452",
  storageBucket: "school-4e452.appspot.com",
  messagingSenderId: "1009189022376",
  appId: "1:1009189022376:web:af6e257b40d6bb7c20309d",
  measurementId: "G-PJHDM9YEB8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

// 
let 
contractCode = '',
// اضافة عقد
contractDate = document.querySelector('#aqd_4araka_gded #DateContract'),
Company = document.querySelector('#aqd_4araka_gded #Company'),
existCompanies = document.querySelector('#aqd_4araka_gded #existCompanies'),
Notes = document.querySelector('#aqd_4araka_gded #Notes'),
CommissionRate = document.querySelector('#aqd_4araka_gded #CommissionRate'),
ManagementRatio = document.querySelector('#aqd_4araka_gded #ManagementRatio'),
TaxNoticeRate = document.querySelector('#aqd_4araka_gded #TaxNoticeRate'),
Partner = document.querySelector('#aqd_4araka_gded #Partner1'),
PartnerRatio,
saveAndNew = document.getElementById('aqd_4araka_gded_saveAndNew'),
saveAndClose = document.getElementById('aqd_4araka_gded_saveAndClose'),
// تعريف الشركة
addCompanyBtn = document.getElementById('t3ref_shrekaa_addCompany'),
companyName = document.getElementById('companyName'),
companyPhone = document.getElementById('companyPhone'),
companyGover = document.getElementById('companyGover'),
// تعريف شريك
addPartnerBtn = document.getElementById('t3ref_shrek_addPartner'),
partnerName = document.getElementById('partnerName'),
partnerPhone = document.getElementById('partnerPhone'),
partnerGover = document.getElementById('partnerGover'),
partnerNote = document.getElementById('partnerNote'),

// المبيعات الشهرية
mbe3at4hriaCode = document.getElementById("mbe3at_4hria_code"),
mbe3at4hriaProccessDate = document.getElementById('mbe3at_4hria_date'),
mbe3at4hriaInterfaceCode = document.getElementById('mbe3at_4hria_interfaceCode'),
mbe3at4hriaTotalSales = document.getElementById('mbe3at_4hria_totalSales'),
mbe3at4hriaDifferenceAmount = document.getElementById('mbe3at_4hria_difference-amount'),
mbe3at4hriaAddMonthlySalesBtn = document.getElementById('add_monthly_sales_btn'),

// المصاريف الشهرية
msaref4hriaCode = document.getElementById("msaref_4hria__code"),
msaref4hriaProccessType = document.getElementById('msaref_4hria_proccessType'),
msaref4hriaCompanyCode = document.getElementById("msaref_4hria_companyCode"),
msaref4hriaPartnerCode = document.getElementById("msaref_4hria_partnerCode"),
msaref4hriaProccessDate = document.getElementById('msaref_4hria_Date'),
msaref4hriaValue = document.getElementById('msaref_4hria_value'),
msaref4hriaStatement = document.getElementById('msaref_4hria_statement'),
msaref4hriaAddMonthlyExpensesBtn = document.getElementById('add_monthly_expenses_btn'),
// مبالغ التامين الشهرية
mbal8Elt2men4ahtiaCode = document.getElementById("mbal8_Elt2men_4hria_code"),
mbale8Tameen4hriaProccessDate = document.getElementById('mbale8_tameen_4hria_date'),
mbale8Tameen4hriaInterfaceCode = document.getElementById('mbale8_tameen_4hria_interfaceCode'),
mbale8Tameen4hriaTotalAmmount = document.getElementById('mbale8_tameen_4hria_total_ammount'),
mbale8Tameen4hriaPeopleNumber = document.getElementById('mbale8_tameen_4hria_peopleNumber'),
mbale8Tameen4hriaInsuranceAmmountBtn = document.getElementById('add_monthly_insuranceAmmount_btn')


// -------------------------------------------------------------------------------------------------------------
// اضفة عقد جديد Script
let contract = {}
contract.PartnerDetails = []

async function saveContract() {
    PartnerRatio = document.querySelectorAll('#aqd_4araka_gded .PartnerRatio')
    contract.PartnerDetails.forEach((partner,index)=>{
        if(PartnerRatio[index].value!==''){
            partner.partnerRatio = PartnerRatio[index].value
        }
    })
    contract = {
        ...contract,
        contractDate:contractDate.value,
        Company:Company.value,
        Notes:Notes.value,
        CommissionRate:CommissionRate.value,
        ManagementRatio:ManagementRatio.value,
        TaxNoticeRate:TaxNoticeRate.value,
        Partner:Partner.value,
        contractCode,

    }


    const contractRef = await addDoc(collection(firestore, "contracts"), contract);
    const contractCodeRef = await setDoc(doc(firestore, "contractCode", "contractCode"), {
        code:++contractCode
      });

    contractCode = ''
    contract = {}
    contract.PartnerDetails = []
    $('#aqd_4araka_gded_form')[0].reset()
    document.querySelectorAll('#aqd_4araka_gded_form .contractCode')[0].value = '(New)'
    document.querySelector('#addPartnersSection').innerHTML = ''
    addAnotherPartner()

    console.log(contract)

}

saveAndNew.addEventListener('click',function(){
    saveContract()
})
saveAndClose.addEventListener('click',function(){
    saveContract()
    $('#aqd_4araka_gded').modal('hide')
})
// company details
async function companyDetailsModal(){
    if(Company.value!==''){
        let companyList = Array.from(document.querySelectorAll('#existCompanies option'))
        let exist = companyList.some((company)=> Company.value==company.value)
        if(!exist){
            $('#t3ref_shrekaa').modal('show')
        }
        else
        {
            const companiesRef = collection(firestore, "companies");

            const q = query(companiesRef, where("companyName", "==", Company.value));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((company) => {
                contract.CompanyDetails={...company.data()}
                // add contract code
                setContractCode()
            });
            $("#t3ref_shrekaa_form")[0].reset()
        }
    }
}
Company.addEventListener('blur',function(){
    companyDetailsModal()
})
Company.addEventListener('keypress',function(e){
    if(e.key === "Enter"){
        companyDetailsModal()
    }
})
addCompanyBtn.addEventListener('click',async function(){
    let CompanyDetails = {
        companyName:companyName.value,
        companyPhone:companyPhone.value,
        companyGover:companyGover.value
    }
    contract.CompanyDetails=CompanyDetails
    const partnerRef = await addDoc(collection(firestore, "companies"), CompanyDetails);
    // add contract code
    setContractCode()
  
     $('#t3ref_shrekaa').modal('hide')
       $("#t3ref_shrekaa_form")[0].reset() 
    })
// partener details
async function partnerDetailsModal(){
    if(Partner.value!==''){
        
        let partnerList = Array.from(document.querySelectorAll('#existPartners'+(contract.PartnerDetails.length+1)+' option'))
        let exist = partnerList.some((partner)=> Partner.value==partner.value)
        if(!exist){
            $('#t3ref_shrek').modal('show')
            console.log("data");
            
        }
        else{
            const citiesRef = collection(firestore, "partners");

            const q = query(citiesRef, where("partnerName", "==", Partner.value));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((partner) => {
                contract.PartnerDetails.push({...partner.data()})
                console.log(partner.data());
            });
            addAnotherPartner()
            $("#t3ref_shrek_form")[0].reset()
        }
    }
}
Partner.addEventListener('blur',function(){
    partnerDetailsModal()
})
Partner.addEventListener('keypress',function(e){
    if(e.key === "Enter"){
        partnerDetailsModal()
    }
})
addPartnerBtn.addEventListener('click',async function(){
    let partnerDetails = {
        partnerName:partnerName.value,
        partnerPhone:partnerPhone.value,
        partnerGover:partnerGover.value,
        partnerNote:partnerNote.value
    }
    contract.PartnerDetails.push(partnerDetails)
        const partnerRef = await addDoc(collection(firestore, "partners"), partnerDetails);
    $('#t3ref_shrek').modal('hide')
    addAnotherPartner()
    $("#t3ref_shrek_form")[0].reset()

    
})
function addAnotherPartner(){
    let partnerRow = document.createElement('div')
    partnerRow.className = 'row partner'
    partnerRow.innerHTML = `
    <div class="col-3 p-0">
        <input type="text" id="PartnerId" class="form-control w-100 h-100 border-0 rounded-0 text-center contractCode" style="border-left: 1px solid black !important;" readonly value=${contractCode}>
    </div>
    <div class="col-5 p-0">
        
        <input list="existPartners${contract.PartnerDetails.length+1}" class="form-control w-100 h-100 border-0 text-center" name="Partner${contract.PartnerDetails.length+1}" id="Partner${contract.PartnerDetails.length+1}">
        <datalist id="existPartners${contract.PartnerDetails.length+1}" style="position: relative; left: 100%;top: 100%;" class="partners">
       
        </datalist>
    </div>
    <div class="col-4 p-0">
        <input type="text" class="form-control w-100 h-100 border-0 rounded-0 text-center PartnerRatio" style="border-right: 1px solid black !important;" id="PartnerRatio">
    </div>
`
    document.querySelector('#addPartnersSection').appendChild(partnerRow)
    Partner = document.querySelector('#aqd_4araka_gded #Partner'+(contract.PartnerDetails.length+1))
    checkChange()
    console.log(Partner);
}



function checkChange() {
    Partner.addEventListener('blur',function(){
        partnerDetailsModal()
    })
    Partner.addEventListener('keypress',function(e){
        if(e.key === "Enter"){
            partnerDetailsModal()
        }
    })
    getPartners()
}


//FireBase

function getPartners(){
    let parteners =document.querySelectorAll(".partners")
    
      onSnapshot(collection(firestore, "partners"), (Partners) => {
        parteners.innerHTML=''
        parteners.forEach((p)=>{
            p.innerHTML=''
              for(let Partner of Partners.docs){
                 let dataOption=document.createElement('option')
                 dataOption.value=Partner.data().partnerName
                 p.appendChild(dataOption)
           
                }
        })
      });
}
getPartners()


//FireBase
getCompanies()
function getCompanies(){
      onSnapshot(collection(firestore, "companies"), (Companies) => {
        existCompanies.innerHTML=''
              for(let Company of Companies.docs){
                 let dataOption=document.createElement('option')
                 dataOption.value=Company.data().companyName
                 existCompanies.appendChild(dataOption)
           
                }
        
      });
}

async function setContractCode(){
  

    const contractCodeRef = collection(firestore, "contractCode");

    const q = query(contractCodeRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((code) => {
        contractCode = code.data().code
    });
    contractCode = contractCode? contractCode : 1   
    document.querySelectorAll('#aqd_4araka_gded_form .contractCode').forEach(code=>{
        code.value = contractCode
    }) 
}

// --------------------------------------------------------------------------------------------------------------------
// script المبيعات الشهرية

let monthlySalesCode=0
async function transformInformation(e) {
    e.preventDefault()

    if (mbe3at4hriaCode.value!== ''&&mbe3at4hriaProccessDate.value!== ''&&mbe3at4hriaInterfaceCode.value!== ''&&mbe3at4hriaTotalSales.value!==''&&mbe3at4hriaDifferenceAmount.value!=='') {
          
        let  monthlySales={
            mbe3at4hriaCode:mbe3at4hriaCode.value,
            mbe3at4hriaProccessDate:mbe3at4hriaProccessDate.value,
            mbe3at4hriaInterfaceCode:mbe3at4hriaInterfaceCode.value,
            mbe3at4hriaTotalSales:mbe3at4hriaTotalSales.value,
            mbe3at4hriaDifferenceAmount:mbe3at4hriaDifferenceAmount.value,
        }

        console.log(monthlySales);
        const contractRef = await addDoc(collection(firestore, "monthlySales"), monthlySales);
        const contractCodeRef = await setDoc(doc(firestore, "monthlySalesCode", "monthlySalesCode"), {
            code:++monthlySalesCode
        });
        $("#mbe3at_4hria").modal('hide')
        $('#mbe3at_4hria_form')[0].reset()
        mbe3at4hriaCode.value='(New)'
    }
}
mbe3at4hriaAddMonthlySalesBtn.addEventListener("click",transformInformation)


function getContractsOfCompany() {
    
    onSnapshot(collection(firestore, "contracts"), (contracts) => {
        mbe3at4hriaInterfaceCode.innerHTML='<option value="" disabled selected></option>'
        for(let contract of contracts.docs){
            
            let dataOption=document.createElement('option')
            dataOption.value=contract.data().contractCode
            dataOption.innerHTML=`
            
            <div>
            ${contract.data().contractCode} :  ${contract.data().CompanyDetails.companyName}
            </div>`
            mbe3at4hriaInterfaceCode.appendChild(dataOption)
            
        }
        console.log(mbe3at4hriaInterfaceCode);
        
      });
}

getContractsOfCompany()


mbe3at4hriaInterfaceCode.addEventListener("change",monthlySalesChangeCode)
async function monthlySalesChangeCode() {
    // mbe3at4hriaCode 
    
    const monthlySalesCodeRef = collection(firestore, "monthlySalesCode");

    const q = query(monthlySalesCodeRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((code) => {
        monthlySalesCode = code.data().code
    });
    monthlySalesCode = monthlySalesCode? monthlySalesCode : 1   
    mbe3at4hriaCode.value = monthlySalesCode
    console.log(monthlySalesCode);
   
}

// ---------------------------------------------------------------------------------

// script مبالغ التأمين الشهرية

let monthlySafeCode=0
async function transformInformationOfSafely(e) {
    e.preventDefault()

    if (mbal8Elt2men4ahtiaCode.value!== ''&&mbale8Tameen4hriaProccessDate.value!== ''&&mbale8Tameen4hriaInterfaceCode.value!== ''&&mbale8Tameen4hriaPeopleNumber.value!==''&&mbale8Tameen4hriaTotalAmmount.value!=='') {
          
  let  monthlySafe={
    mbal8Elt2men4ahtiaCode:mbal8Elt2men4ahtiaCode.value,
    mbale8Tameen4hriaProccessDate:mbale8Tameen4hriaProccessDate.value,
    mbale8Tameen4hriaInterfaceCode:mbale8Tameen4hriaInterfaceCode.value,
    mbale8Tameen4hriaPeopleNumber:mbale8Tameen4hriaPeopleNumber.value,
    mbale8Tameen4hriaTotalAmmount:mbale8Tameen4hriaTotalAmmount.value,
}


const monthlySafelyRef = await addDoc(collection(firestore, "monthlySafely"), monthlySafe);
const monthlySafelyCodeRef = await setDoc(doc(firestore, "monthlySafelyCode", "monthlySafelyCode"), {
    code:++monthlySafeCode
  });
  $("#mbale8_tameen_4hria").modal('hide')
  $('#mabla8_elt2men_4hria_form')[0].reset()
  mbal8Elt2men4ahtiaCode.value='(New)'
    }
}
mbale8Tameen4hriaInsuranceAmmountBtn.addEventListener("click",transformInformationOfSafely)


function getContractsOfCompanyByMonthlySafely() {
    
    onSnapshot(collection(firestore, "contracts"), (contracts) => {
        mbale8Tameen4hriaInterfaceCode.innerHTML='<option value="" disabled selected></option>'
              for(let contract of contracts.docs){
                 let dataOption=document.createElement('option')
                // dataOption.innerHTML=`<div ">name : code</div>`
                //contractCode
                dataOption.value=contract.data().contractCode
                 dataOption.innerHTML=`
                 
                 <div>
                ${contract.data().contractCode} :  ${contract.data().CompanyDetails.companyName}
                 </div>`
                 mbale8Tameen4hriaInterfaceCode.appendChild(dataOption)
           
                }
        
      });
}

window.onload=getContractsOfCompanyByMonthlySafely


mbale8Tameen4hriaInterfaceCode.addEventListener("change",monthlySafelyChangeCode)
async function monthlySafelyChangeCode() {
    
    
    const monthlySafelyCodeRef = collection(firestore, "monthlySafelyCode");

    const q = query(monthlySafelyCodeRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((code) => {
        monthlySafeCode = code.data().code
    });
    monthlySafeCode = monthlySafeCode? monthlySafeCode : 1   
    mbal8Elt2men4ahtiaCode.value = monthlySafeCode
    console.log(monthlySafeCode);
   
}

// script المصاريف الشهرية

let companyMonthlyExpenses = document.getElementById('company_monthly_expenses')
let partnerMonthlyExpenses = document.getElementById('partner_monthly_expenses')
let monthlyExpensesCode = ''
msaref4hriaProccessType.addEventListener("change",function(e){
    monthlyExpensesProccessType(e)
})

function monthlyExpensesProccessType(e){
    if(e.target.value==1){
        // show company code
        companyMonthlyExpenses.setAttribute('style', 'display: flex !important;')
        partnerMonthlyExpenses.setAttribute('style', 'display: none !important;')
        getContractsOfCompanyByMonthlyExpenses()
    }
    else{
        // show partner code
        companyMonthlyExpenses.setAttribute('style', 'display: none !important;')
        partnerMonthlyExpenses.setAttribute('style', 'display: flex !important;')
        getPartnersByMonthlyExpenses()
    }
}

function getContractsOfCompanyByMonthlyExpenses() {
    
    onSnapshot(collection(firestore, "contracts"), (contracts) => {
        msaref4hriaCompanyCode.innerHTML='<option value="" disabled selected></option>'
              for(let contract of contracts.docs){
                 let dataOption=document.createElement('option')
                
                dataOption.value=contract.data().contractCode
                 dataOption.innerHTML=`
                 
                 <div>
                ${contract.data().contractCode} :  ${contract.data().CompanyDetails.companyName}
                 </div>`
                 msaref4hriaCompanyCode.appendChild(dataOption)
           
                }
        
      });
}

function getPartnersByMonthlyExpenses() {
    
    onSnapshot(collection(firestore, "partners"), (partners) => {
        msaref4hriaPartnerCode.innerHTML='<option value="" disabled selected></option>'
              for(let partner of partners.docs){
                 let dataOption=document.createElement('option')
                
                dataOption.value=partner.id
                 dataOption.innerHTML=`
                 
                 <div>
                ${partner.data().partnerName}
                 </div>`
                 msaref4hriaPartnerCode.appendChild(dataOption)
           
                }
        
      });
}

msaref4hriaCompanyCode.addEventListener("change",monthlyExpensesChangeCode)
msaref4hriaPartnerCode.addEventListener("change",monthlyExpensesChangeCode)
async function monthlyExpensesChangeCode() {
    
    const monthlyExpensesCompanyCodeRef = collection(firestore, "monthlyExpensesCode");

    const q = query(monthlyExpensesCompanyCodeRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((code) => {
        monthlyExpensesCode = code.data().code
    });
    monthlyExpensesCode = monthlyExpensesCode? monthlyExpensesCode : 1   
    msaref4hriaCode.value = monthlyExpensesCode
   
}

function transformInformationOfMonthlyExpenses(e) {
    e.preventDefault()

    let  monthlyExpenses={}
    if (msaref4hriaCode.value!== ''&&msaref4hriaProccessType.value!== ''&&msaref4hriaProccessDate.value!== ''&&msaref4hriaValue.value!==''&&msaref4hriaStatement.value!=='') {
                
        monthlyExpenses={
            msaref4hriaCode:msaref4hriaCode.value,
            msaref4hriaProccessType:msaref4hriaProccessType.value==1?'shared':'private',
            msaref4hriaProccessDate:msaref4hriaProccessDate.value,
            msaref4hriaValue:msaref4hriaValue.value,
            msaref4hriaStatement:msaref4hriaStatement.value,
        }

        if(msaref4hriaProccessType.value==1&&msaref4hriaCompanyCode.value!=''){
            // add contract code
            monthlyExpenses.companyContractCode = msaref4hriaCompanyCode.value
            saveToFirebase(monthlyExpenses)
        }
        else if(msaref4hriaPartnerCode.value!=''){
            // add partner id
            monthlyExpenses.partnerID = msaref4hriaPartnerCode.value
            saveToFirebase(monthlyExpenses)
        }

    }
}
msaref4hriaAddMonthlyExpensesBtn.addEventListener("click",transformInformationOfMonthlyExpenses)

async function saveToFirebase(monthlyExpenses){
    const monthlyExpensesRef = await addDoc(collection(firestore, "monthlyExpenses"), monthlyExpenses);
    const monthlyExpensesCodeRef = await setDoc(doc(firestore, "monthlyExpensesCode", "monthlyExpensesCode"), {
        code:++monthlyExpensesCode
    });
    $("#msaref_4hria").modal('hide')
    $('#msaref_4hria_form')[0].reset()
    msaref4hriaCode.value = '(New)'
}

// script حصص الشركاء

getContracts()
function getContracts(){
    onSnapshot(collection(firestore, "contracts"), (contracts) => {
        let monthContract = new Object()
              for(let contract of contracts.docs){
                    if(monthContract[contract.data().contractDate]){
                        monthContract[contract.data().contractDate].push(contract.data())
                    }
                    else{
                        monthContract[contract.data().contractDate]=[contract.data()]
                    }
                    var mydate = new Date(contract.data().contractDate);
                    var month = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
                    var str = month + ' ' + mydate.getFullYear();
                    console.log(str)
                }
                console.log(monthContract)
        
      });
}