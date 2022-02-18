document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Compose email
document.querySelector('#compose-form').addEventListener('submit', (event) => {
  event.preventDefault();
  submit_email();
})
  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {
        
    // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#letter-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

  function submit_email() {
    const submit = document.querySelector('.btn btn-primary');
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

            fetch('/emails', {
            method: 'POST',
            body: JSON.stringify ({ 
              recipients: recipients,
              subject: subject,
              body: body
            })
          })
          .then(response => response.json())
          .then(result => {
            load_mailbox('sent');              
            })
    
  }


function load_mailbox(mailbox) {            
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#letter-view').style.display = 'none';
 // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  fetch(`/emails/${mailbox}`)
        .then(response => response.json())
          .then(emails  => {
              emails.forEach(email =>{
                    console.log(email);
                    
                    // Створити новий допис
                    const view = document.createElement('div');
                    const but_archived = document.createElement('button');
                    but_archived.className ='but_archived';
                    view.className = 'view';
                    // Додати допис до DOM
                    document.querySelector('#emails-view').append(view);

                if (mailbox === 'inbox' || mailbox === 'archive'){
                    view.innerHTML = `<h5>Від: ${email.sender} </h5>  <p>Тема: ${email.subject}</p> ${email.timestamp} `;
                    view.append(but_archived);
                } else {view.innerHTML = `<h5>Кому: ${email.recipients} </h5>  <p>Тема: ${email.subject}</p> ${email.timestamp} `;
                   }

                if (mailbox === 'inbox') {
                  but_archived.innerHTML = 'Додати в архів';
                } 
                if (mailbox === 'archive') {
                  but_archived.innerHTML = 'Розархівувати';
                }

               
              function archive(email_id){
                fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                    archived: true
                    })
                  })
                  .then(() => {
                    console.log('Archived');               
                    })
                  
              }
                  
              function re_archive(email_id){
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                  archived: false
                  })
                })
                  .then(() => {
                  console.log('reArchived');                       
                  })
                  
               }
    

               if (mailbox === 'inbox') {
                but_archived.addEventListener('click', () => {
                  archive(email.id);
                  but_archived.parentElement.remove();
                });                
              }
              
              if (mailbox === 'archive') {
                but_archived.addEventListener('click', () => {
                  re_archive(email.id);
                  but_archived.parentElement.remove();
                });   
              }
              
              function as_read(email_id){
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                  read: true
                  })
                })
                .then(() => {
                  console.log(`readed - ${email.id}`);                       
                  })
              }        

                const but_read = document.createElement('button');
                but_read.className = 'but_read';
                but_read.innerHTML = 'open letter';
                view.append(but_read);

                /* view.addEventListener('click', () =>{
                  as_read(email.id);
                }) */
                
                but_read.addEventListener('click', () =>{ 
                  open_letter(email.id);
                  as_read(email.id);
                })
                
                if (email.read === true){
                  view.style = 'background-color:  rgb(172, 165, 165)';
                } else {
                  view.style = 'background-color: white';
                  }  

        });  // END  emails.forEach(email =>{     
  }); // END fetch.then(emails  => {  
} 
  

function open_letter(email_id){
  // Show the letter-view and hide other views
document.querySelector('#emails-view').style.display = 'none';
document.querySelector('#compose-view').style.display = 'none';
document.querySelector('#letter-view').style.display = 'block';

  fetch(`/emails/${email_id}`)
    .then(response => response.json())
      .then(email  => {
              console.log(`open ${email.id}`); 
         

        const letter = document.createElement('div');
        const but_reply = document.createElement('button');
        but_reply.className = 'but_reply';
        but_reply.innerHTML = 'Reply'
        letter.className = 'letter';
        letter.innerHTML = `<h5>Від: ${email.sender} </h5> <h5>Кому: ${email.recipients} </h5>  <p class="letter-subject">Тема: ${email.subject}</p> <p class="time">${email.timestamp}</p> <p>_____________</p> <p> ${email.body}</p> `;
           // Додати допис до DOM
        document.querySelector('#letter-view').append(letter);
        letter.append(but_reply);

            function reply(sender, subject, timestamp, body){
              compose_email();
              document.querySelector('#compose-recipients').value = sender;
             if (subject.substring(0, 3) !== 'Re:') {
                document.querySelector('#compose-subject').value = `Re:${email.subject}`;
              } else{
                document.querySelector('#compose-subject').value = email.subject
              }
              document.querySelector('#compose-body').value = `On  ${timestamp}  ${sender} wrote: \n${body}\n`;
          }
           
          but_reply.addEventListener('click', ()=>{
            reply(email.sender, email.subject, email.timestamp, email.body);
            console.log(`Reply`)
          });
    });
 
}
