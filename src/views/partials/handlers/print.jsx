export const handlePrint = async (printRef, pageType = 'A4', printTitle = 'প্রিন্ট ডকুমেন্ট', pageLayout = 'portrait') => {
   if (!printRef) {
      alert("প্রিন্ট রেফারেন্স (Document to be Printed) প্রদান করতে হবে");
      return; // popup blocked safety
   }

   const printContent = printRef.current.innerHTML;
   const printWindow = window.open("", "", "fullscreen=yes");

   if (!printWindow) {
      alert("পপআপ (popup) চালু করতে হবে");
      return; // popup blocked safety
   }

   const doc = printWindow.document;

   // ---- HTML skeleton ----
   doc.documentElement.lang = "bn";

   // ---- HEAD ----
   const head = doc.head;

   // title
   const title = doc.createElement("title");
   title.textContent = printTitle;
   head.appendChild(title);

   // bootstrap css
   const bootstrapLink = doc.createElement("link");
   bootstrapLink.rel = "stylesheet";
   bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
   head.appendChild(bootstrapLink);

   // font css
   const fontLink = doc.createElement("link");
   fontLink.rel = "stylesheet";
   fontLink.href = "https://fonts.maateen.me/siyam-rupali/font.css";
   head.appendChild(fontLink);

   // print styles
   const style = doc.createElement("style");
   style.textContent = `
      @page {
         size: ${pageType} ${pageLayout} !important;
         margin: 0 !important;
         padding: 0.5in !important;
      }

      div, table, tr, th, td, p, span {
         break-inside: avoid !important;
         page-break-inside: avoid !important;
         /* border: 0px; */
      }
      
      section {
         break-before: always !important; /* Modern syntax */
         page-break-before: always !important;
      }

      * {
         /* color: #000000 !important; */
         font-family: 'Kalpurush','Consolas','Siyam Rupali', sans-serif !important;
         /* font-size: 16px !important; */
      }

      .print-nowrap{
         white-space: nowrap !important;
      }

      .no-print {
         display: none !important;
      }

      .print-hide {
         display: none !important;
      }

      .print-show {
         display: block !important;
      }
   `;
   head.appendChild(style);

   // ---- BODY ----
   const body = doc.body;

   const container = doc.createElement("div");
   container.className = "d-flex justify-content-center align-items-start";
   container.innerHTML = printContent; // controlled HTML
   body.appendChild(container);

   // ---- PRINT HANDLER ----
   printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
         printWindow.close();
         window.close();
      };
   };
};