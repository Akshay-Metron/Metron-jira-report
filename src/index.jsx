import ForgeUI,
{
  render,
  ProjectPage,
  Fragment,
  Text,
  Table,
  Head,
  Row,
  Cell,
  useProductContext,
  useState,
  Heading,
  DatePicker,
  Form,
  useEffect
}
  from '@forge/ui';

import api, { route } from "@forge/api";

import moment from 'moment';




var issue_keys = []
var fetch_worklog = [];
var all_WorkLogs = []
var projectkey = "";
const fetchworklogsForIssue = async (issueId) => {

  for (let i = 0; i < issue_keys.length; i++) {
    const element = issue_keys[i];




    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${element}/worklog`,
      {
        headers:
        {
          'Accept': 'application/json'
        }

      });


    fetch_worklog = await response.json();
    all_WorkLogs.push(...fetch_worklog.worklogs);


  }
  //console.log(all_WorkLogs[3].comment.content[0].content[1].content[0]);

  //console.log(all_WorkLogs[3].comment.content[0].content[1].content[0].content[0].text);
  return fetch_worklog
}






const projectStatuses = async (issueId) => {
  const response4 = await api.asApp().requestJira(route`/rest/api/3/search?jql=project%20%3D%20${projectkey}`,
    {
      headers: {
        'Accept': 'application/json'
      }
    });

  const fetch_project = await response4.json();
  //console.log(`Response4: ${response4.status} ${response4.statusText}`);
  //console.log(await response4.json());

  return fetch_project
};

 var date = new Date();
 var firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD');
 var today= moment(new Date().toLocaleString() + "").format('YYYY-MM-DD')
 //var lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('YYYY-MM-DD');

 console.log(firstDay);
 //console.log(lastDay);
 console.log(today);
var startDate = firstDay
var endDate = today
//const [all_worklog]= useState(async () => await fetchworklogsForIssue(context.platformContext.issueKey));
const App = () => {

  const [formState, setFormState] = useState(undefined)
  const context = useProductContext();

  const onSubmit = async (formData) => {

    formData:
    {

        startDate: 's_date';
        endDate: 'e_date';
      
    }
    console.log(formData);
    setFormState(formData)
    startDate = formData.s_date
    endDate=formData.e_date

    const all_WorkLogs = await fetchworklogsForIssue(context.platformContext.issueKey);
    
  }

  projectkey = context["platformContext"]["projectKey"]
  //const [fetch_worklog] = useState(async () => await fetchworklogsForIssue(context.platformContext.issueKey));
  const [fetch_project] = useState(async () => await projectStatuses(context.platformContext.issueKey));

  
  var totalHours = 0

  const issueKeys = fetch_project.issues;


  for (let i = 0; i < issueKeys.length; i++) {
    const element = issueKeys[i];

    if ((moment(element.fields.created).format('YYYY-MM-DD'))>=startDate  && (moment(element.fields.created).format('YYYY-MM-DD')<=endDate))
    totalHours = totalHours + (element.fields.timespent) / 3600;
    //console.log(moment(element.fields.created).format('YYYY-MM-DD'));

    issue_keys[i] = element.key
  }

  



  return (
    <Fragment>

      <Heading size="large">Metron Labs support hours report </Heading>


      <Table>



        <Row>
          <Cell>
            <Heading size='medium'>{fetch_project.issues[0].fields.project.name}</Heading>
          </Cell>

        </Row>




        <Row>
          <Cell>

            <Form onSubmit={onSubmit} /*actionButtons={actionButtons}*/>

              <DatePicker name="s_date" label="Start Date" defaultValue={firstDay}  />

              <DatePicker name="e_date" label="End Date" defaultValue={today}  />
            </Form>

          </Cell>

        </Row>



        <Row>

          <Cell>

            <Heading size='medium'>
              
             Total: {totalHours} Hours
             
            </Heading>

          </Cell>

        </Row>

      </Table>

      <Heading size="large"> Issue Overview  </Heading>

      <Table>

        <Head>

          <Cell>
            <Text>Key</Text>
          </Cell>
          <Cell>
            <Text>Summary</Text>
          </Cell>
          <Cell>
            <Text>Hours</Text>
          </Cell>

        </Head>


        {fetch_project.issues.map(issue => {
          if ((moment(issue.fields.created).format('YYYY-MM-DD'))>=startDate  && (moment(issue.fields.created).format('YYYY-MM-DD')<=endDate)){
          

        return <Row>

          <Cell>
            
              <Text>{issue.key}</Text>
            
          </Cell>

          <Cell>
            

              <Text>{issue.fields.summary}</Text>
            
          </Cell>

          <Cell>
            

              <Text>{Math.round(issue.fields.timespent) / 3600}</Text>
            
          </Cell>
        </Row>

          }}
        )}



      </Table>


      <Heading size="large"> Work Log Details  </Heading>



      {fetch_project.issues.map(issue => {
      
      if((moment(issue.fields.created).format('YYYY-MM-DD'))>=startDate  && (moment(issue.fields.created).format('YYYY-MM-DD')<=endDate)){

     
       return <Table>

          <Head>

            <Cell>

              <Heading size="Medium">

                <Text>{issue.key}</Text>

              </Heading>

            </Cell>

            <Cell>
              <Heading size="Medium">

                <Text>{issue.fields.summary}</Text>

              </Heading>
            </Cell>


            <Cell>

              <Heading size="Medium">

                <Text>{Math.round(issue.fields.timespent) / 3600} Hours </Text>

              </Heading>
            </Cell>

          </Head>

          

          {all_WorkLogs.map(work => {

            
            if (issue.id === work.issueId){
             
              return (<Row>


                <Cell>
                  <Text>{moment(work.started).format('DD MMM, YYYY,  HH:MM:SS')}</Text>
                  
                </Cell>

                <Cell>{work.comment.content.map(multiComments=>{
                   
                     
                      return <Fragment>
                        
                     {multiComments.content.map(bullets=>
                      
                      {
                        if(bullets.content!=null){
                          
                           return <Fragment>
                           <Text> - {bullets.content[0].content[0].text} </Text>
                           {console.log(bullets.content[0].content[0].text)}
                           </Fragment>
                        }
                        else{
                          
                            return <Fragment>
                             <Text>{bullets.text} </Text>
                            {console.log(bullets.text)}
                            </Fragment>

                        }
                        
                      
                      }
                        
                      )
                      
                    }</Fragment>
                    
                        
                     }
                     
                      )
                  }

                </Cell>

                {/*console.log(all_WorkLogs[3].comment.content[0].content[1].content[0].content[0].text)*/}
                <Cell>
                  <Text>{Math.round(work.timeSpentSeconds) / 3600}</Text>
                </Cell>


              </Row>);
            
          }
          })}


        </Table>
      
        }} 
    
  )}

    </Fragment >
  );

};

export const run = render(
  <ProjectPage>
    <App />
  </ProjectPage>
);
