import React, { Component } from 'react';
import './Exercise.scss';
import ReactQuill from 'react-quill';

class Exercise extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            score: 0
        }
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(event) {
        const target = event.target;

        if (target != null) {
            this.setState({ score: target.value })
        } else {
            this.setState({ text: event })
        }
    }

    modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
            ['link', 'image', 'video'],
            ['formula', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ]
    }

    render() {
        return (
            <div className="exercise mb-4">
                <div className="d-flex justify-content-between mb-3">
                    <h3>Questão 1</h3>
                    <div>
                        <input type="number" min="0" value={this.state.score} onChange={this.handleInputChange} name="score"></input>
                        <label htmlFor="score">pontos</label>
                    </div>
                </div>
                <ReactQuill placeholder="Escreva aqui a sua pergunta..." value={this.state.text} onChange={this.handleInputChange} modules={this.modules} />
            </div>
        );
    }
}

export default Exercise;