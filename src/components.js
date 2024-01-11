var root = ReactDOM.createRoot(document.getElementById("root"));

// function component - daha yoğun kullanılıyor
// class component

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.clearItems = this.clearItems.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.state = {
            items: ['Görev 1', 'Görev 2', 'Görev 3']
        }
    }

    deleteItem(item) {
        this.setState((prevState) => {
            const arr = prevState.items.filter((i) => {
                return item != i;
            });

            return {
                items: arr
            }
        });
    }
    
    clearItems() {
        this.setState({
            items: []
        });
    }

    addItem(item) {
        if(this.state.items.indexOf(item) > -1) {
            return "Aynı elemanı ekleyemezsiniz.";
        }

        this.setState((prevState) => {
            return { items: prevState.items.concat(item)}
        });
    }

    render() {
        const data = {
            title: "Todo Uygulaması",
            description: "Bekleyen Görevler"
        }
        return (
            <div className="container my-3">
                <div className="card">
                    <div className="card-header">
                        <Header title={ data.title } description={ data.description }/>
                    </div>
                    <div className="card-body">
                        <TodoList items={ this.state.items } clear={ this.clearItems } deleteItem= { this.deleteItem } />
                    </div>
                    <div className="card-footer">
                        <NewItem addItem={ this.addItem }/>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const json_obj = localStorage.getItem("items");
        const items = JSON.parse(json_obj);

        if(items) {
            this.setState({
                items: items
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.items.length !== this.state.items.length) {
            const json_str =  JSON.stringify(this.state.items);
            localStorage.setItem("items", json_str);
        }
    }
}

const  Header = (props) => {
    return (
        <div className="text-center">
            <h1 className="h3"> { props.title } </h1>
            <p> { props.description } </p>
       </div>
    );
}

const TodoList = (props) => {
    return (
        <div>
            <ul className="list-group">
                {
                    props.items.map((item, index) =><TodoItem key={ index } 
                    item={ item } deleteItem={ props.deleteItem }/>)
                }
            </ul>
            {
                props.items.length > 0 
                ?
                <p>
                    <button className="btn btn-outline-danger float-end mt-3" onClick = { props.clear } >Temizle</button>
                </p>
                :
                <div className="alert alert-warning">
                    Bir görev ekleyiniz.
                </div>
            }

        </div>
    );
}

class NewItem extends React.Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            error: ''
        }
    }

    onFormSubmit(e) {
        e.preventDefault();

        const item = e.target.elements.txtItem.value.trim();
        if(item) {
            e.target.elements.txtItem.value = "";
            const error = this.props.addItem(item);
            this.setState({
                error: error
            })
        }
    }

    render() {
        return (
            <div>
                { this.state.error && <p> { this.state.error } </p>}
                <form onSubmit = { this.onFormSubmit }>
                    <div className="input-group">
                        <input className="form-control" type="text" name="txtItem"/>
                        <button className="btn btn-primary" type="submit">Ekle</button>
                    </div>
                </form>
            </div>
        );
    }

    componentDidUpdate() {
        console.log("NewItem güncellendi");
    }
}

const TodoItem = (props) => {
    return( 
        <li className="list-group-item"> 
            { props.item } 
            <button className="btn btn-danger btn-sm float-end" onClick={ () => { props.deleteItem(props.item) } }> X </button>
        </li>
    );
}

root.render(<TodoApp />);