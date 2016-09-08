var Page = React.createClass({
    render: function () {
        var hash = window.location.hash;
        if (hash) {
            hash = hash.substr(1);
        }

        var parameters = {};
        var search = window.location.search;
        if (search) {
            search = search.substr(1).split('&');
            search.forEach(function (param) {
                param = param.split('=');
                if (2 === param.length) {
                    parameters[param[0]] = param[1];
                }
            });
        }

        switch (hash) {
            case 'upload':
                return <Upload parameters={parameters}/>;

            case 'details':
                return <Details parameters={parameters}/>;

            case 'overview':
            default:
                return <Overview parameters={parameters}/>;
        }
    }
});

var Upload = React.createClass({
    render: function () {
        return (
            <div>
                <div className="columns small-12">
                    <h1>Neues Buch hinzufügen</h1>
                </div>

                <form action="/upload" method="POST">
                    <InputField type="text" label="Titel" name="title" />
                    <InputField type="text" label="Autor" name="author" />
                    <InputField type="number" label="Erscheinungsjahr" name="year" />
                    <InputField type="number" label="Auflage" name="edition"/>
                    <InputField type="text" label="ISBN" name="isbn" />
                    <InputField type="text" label="Genre" name="genre" />
                    <InputField type="file" label="PDF" name="file" />
                    <InputField type="submit" name="submit" />
                </form>
            </div>
        );
    }
});

var InputField = React.createClass({
    render: function () {
        var type = this.props.type || 'text';
        var name = this.props.name;
        var classNames = 'input-field clearfix';
        if (this.props.required || undefined === this.props.required) {
            classNames += ' required';
        }

        var label = this.props.label;
        if (label) {
            label = <label htmlFor={name}>{label}</label>;
        }

        return (
            <div className={classNames}>
                <div className="columns small-12 medium-3">
                    {label}
                </div>
                <div className="columns small-12 medium-6 medium-pull-3">
                    <input type={type} name={name} id={name} />
                </div>
            </div>
        );
    }
});

var Details = React.createClass({
    render: function () {
        if (!this.props.parameters.isbn) {
            window.location = '/';
        }

        var details = [];

        if (this.state.error) {
            details.push(
                <DetailItem label="Fehler" value="Das Buch wurde nicht gefunden"/>
            );
        }
        else if (this.state.isbn) {
            var link = <a href={'/list/' + this.props.parameters.isbn + '/pdf'} target="_blank">
                        <i className="fa fa-download" /></a>;

            details.push(
                <DetailItem label="Autor" value={this.state.author}/>,
                <DetailItem label="Ausgabe" value={this.state.year + ' - Auflage ' + this.state.edition}/>,
                <DetailItem label="Genre" value={this.state.genre}/>,
                <DetailItem label="ISBN" value={this.state.isbn}/>,
                <DetailItem label="Download" value={link}/>
            );
        }

        return (
            <div className="details">
                <div className="clearfix">
                    <div className="columns small-12">
                        <h1>{this.state.title}</h1>
                    </div>
                </div>
                {details}
            </div>
        );
    },

    getInitialState: function () {
        return {
            title: 'Buchdetails werden geladen'
        };
    },

    componentDidMount: function () {
        var self = this;

        $.ajax('/list/' + self.props.parameters.isbn, {
            method: 'get',
            success: function (response) {
                if (response.isbn) {
                    var book = response.isbn;
                    book.isbn = self.props.parameters.isbn;

                    self.setState(book);
                }
                else {
                    self.setState({
                        error: true
                    });
                }
            }
        });
    }
});

var DetailItem = React.createClass({
    render: function () {
        if (this.props.value) {
            return (
                <div className="detail-item list-item clearfix">
                    <div className="columns small-12 medium-3">
                        <strong>{this.props.label}</strong>
                    </div>
                    <div className="columns small-12 medium-9">
                        {this.props.value}
                    </div>
                </div>
            );
        }

        return null;
    }
})

var Overview = React.createClass({
    render: function () {
        var self = this;

        var books = [];

        for (var isbn in self.state.books) {
            if (self.state.books.hasOwnProperty(isbn)) {
                books.push(<Book data={self.state.books[isbn]} isbn={isbn} />);
            }
        }

        if (0 === books.length) {
            books = <p>Keine Bücher vorhanden</p>;
        }

        return (
            <div>
                <div className="relative clearfix">
                    <div className="columns small-12">
                        <h1>Book Bakery</h1>
                    </div>
                    <a href="/#upload" className="add-book" title="Buch hinzufügen">
                        <i className="fa fa-plus right" />
                    </a>
                </div>
                <div className="book-list">
                    {books}
                </div>
            </div>
        );
    },

    getInitialState: function () {
        return {
            books: {}
        };
    },

    componentDidMount: function () {
        var self = this;

        $.ajax('/list', {
            method: 'get',
            success: function (response) {
                self.setState({
                    books: response
                });
            },
            failure: function () {
                console.log('error');
            }
        });
    }
});

var Book = React.createClass({
    render: function () {
        return (
            <div className="columns small-12 book list-item">
                <h3>{this.props.data.title}</h3>
                <span className="author">{this.props.data.author}</span>
                <span className="version">{this.props.data.year}, Auflage {this.props.data.edition}</span>
                <a href={'/?isbn=' + this.props.isbn + '#details'}>
                    <i className="right fa fa-chevron-right"></i>
                </a>
            </div>
        );
    }
})

ReactDOM.render(
    <Page/>,
    document.getElementById('app')
);