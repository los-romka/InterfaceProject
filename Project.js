;function Button( name, click ) {
    this.btn = document.createElement( 'button' );
    this.btn.textContent = name;
    this.btn.onclick = click;

    return this.btn;
}