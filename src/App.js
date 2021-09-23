import React from 'react';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      todoList:[],
      activeItem:{
        id: null,
        title:'',
        completed:false,
      },
      editing: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)

  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentWillMount(){
    this.fetchTasks();
  }

  fetchTasks(){
    fetch('https://weblaba1.herokuapp.com/main/task-list/')
    .then(response=> response.json())
    .then(data =>
      this.setState({
        todoList:data

      })
    )
  }

  handleChange(e){
    //var name = e.target.name
    var value = e.target.value
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title: value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    var csrftoken = this.getCookie('csrftoken')
    var url = 'https://weblaba1.herokuapp.com/main/task-create/'

    if(this.state.editing === true){
      url = `https://weblaba1.herokuapp.com/main/task-update/${this.state.activeItem.id}/`
      this.setState({
        editing:false,
      })

    }
    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken': csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then(
      (response) => {
        this.fetchTasks()
        this.setState({
          activeItem:{
            id: null,
            title:'',
            completed:false,
          }
        })
      }).catch(function(error){
        console.log('ERROR', error)
      })
  }

  startEdit(task){
    this.setState({
      activeItem: task,
      editing:true,
    })
  }

deleteItem(task){
  var csrftoken = this.getCookie('csrftoken')
  fetch(`https://weblaba1.herokuapp.com/main/task-delete/${task.id}/`,{
    method:'DELETE',
    headers:{
      'Content-type':'application/json',
      'X-CSRFToken': csrftoken,
    },
  }).then((response)=>{
    this.fetchTasks()
  })
}

strikeUnstrike(task){
  var csrftoken = this.getCookie('csrftoken')
  var url = `https://weblaba1.herokuapp.com/main/task-update/${task.id}/`
  task.completed = !task.completed
  fetch(url, {
    method:'POST',
    headers:{
      'Content-type':'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({'completed': task.completed, 'title':task.title})
  }).then((response)=>{
    this.fetchTasks()
  })

}

  render(){
    var tasks = this.state.todoList
    var self = this
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex: 6}}>
                  <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task"/>
                </div>
                <div style={{flex: 1}}>
                  <input className="btn btn-warning" id="submit" type="submit" name="Add"/>
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map(function(task, index){
              return (
                <div key= {index} className="task-wrapper flex-wrapper">
                  <div onClick={()=> self.strikeUnstrike(task)} style={{flex:7}}>
                    {task.completed == false ? (<span>{task.title}</span>) : (<strike>{task.title}</strike>)}
                  </div>
                  <div style={{flex:1}}>
                    <button onClick={()=> self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                  </div>
                  <div style={{flex:1}}>
                      <button onClick={()=> self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">X</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}


export default App;
