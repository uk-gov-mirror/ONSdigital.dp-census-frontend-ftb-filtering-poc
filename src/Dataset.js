import React from 'react';
import './App.css';
import {Header} from "./Header";
import {Footer} from "./Footer";
import {DatasetDimOpt} from "./DatasetDimOpt";
import MockCodeBook from "./assets/mock_responses/MockCodeBook";


export class Dataset extends React.Component {

    state = {
        name: ""
    };

    componentDidMount() {
        const {name} = this.props.match.params;
        this.setState({
            "name": name,
            "codeBook": {},
            "indexAddingDimOpt": -1
        });
        this.getCodeBook();
    }


    async getCodeBook() {
        //curl -XGET "http://99.80.12.125:10100/v6/codebook/Example"
        // Actual request
        const requestOptions = {
            method: 'GET'
        };
        let demoResponse;
        try {
            const response = await fetch(this.ftbDomain + "/codebook" + this.props.match.params.name, requestOptions);
            // Actual Response
            demoResponse = await response.json();
        } catch {
            demoResponse = MockCodeBook;
        }
        this.setState(({codeBook: demoResponse}));

    }

    render() {
        let dimensions = [];
        if (this.state.codeBook != null && this.state.codeBook.codebook != null) {
            let codeBook = this.state.codeBook.codebook;
            for (let i = 0; i < codeBook.length; i++) {
                let singleDim = <DatasetDimOpt label={codeBook[i].label}/>;
                dimensions.push(singleDim)
            }
        }

        return (
            <div>
                <Header/>
                <h1 className="wrapper">Dataset: {this.props.match.params.name}</h1>
                <div className="wrapper adjust-font-size--16 page-content link-adjust background--gallery">
                    <ul className="list--neutral filter-overview">
                        <li className="margin-left--0 padding-bottom--2 padding-top--0 padding-right--2 width-lg--56">
                            <a className="float-el--right-md float-el--right-sm float-el--right-lg"
                               href="/filters/c53f1a7c-ecf1-4abf-a104-f8f00cd57994/dimensions/clear-all">Clear
                                filters</a>
                        </li>
                        {dimensions}
                    </ul>
                    <div className="btn--no-click padding-bottom--4 padding-left--2 padding-top--2">
                        <div className="filter-overview__error-container" id="error-container"></div>
                        <form method="post" action="/filters/c53f1a7c-ecf1-4abf-a104-f8f00cd57994/submit">
                            <input id="preview-download" type="submit" value="Apply filters"
                                   className="btn btn--primary btn--primary-disabled btn--thick btn--wide btn--big btn--focus margin-right--2 font-weight-700 font-size--17"
                                   name="preview-and-download"/>
                        </form>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}