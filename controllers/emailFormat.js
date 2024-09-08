const transporter = require('../emailer')

// Leaving untoched in case I decide to use, for sure needs some touch ups to displaying errors

const sendMessage = async (req, res) => {
    try {
        const cart = JSON.parse(req.body.cart)
        let cartToSend = ``;
        let cartTotal = 0;
        cart.forEach(item => {
            let itemTotal = item.price * item.productAmount
            cartTotal += itemTotal
            let cartItem = `
            <div style="margin: 10px; display: flex; border: solid blue 1px; padding: 10px; border-radius: 5px; justify-content: space-between;">
                <img src="cid:${item.imgName}" height="100px">
                <div display: flex; flex-direction: column;>
                    <div style="padding: 5px;">
                        <span style="padding-right: 5px; font-size: 1.25rem;">Product Name:</span><span style="padding-right: 5px; font-size: 1.25rem;">${item.name}</span>
                    </div>
                    <div style="padding: 5px;">
                        <span style="padding-right: 5px; font-size: 1.25rem;">Product Price:</span><span style="padding-right: 5px; font-size: 1.25rem;">${item.price}</span>
                    </div>
                    <div style="padding: 5px;">
                        <span style="padding-right: 5px; font-size: 1.25rem;">Amount of Product:</span><span style="padding-right: 5px; font-size: 1.25rem;">${item.productAmount}</span>
                    </div>
                    <div style="padding: 5px;">
                        <span style="padding-right: 5px; font-size: 1.25rem;">Total Price:</span><span style="padding-right: 5px; font-size: 1.25rem;">${item.price * item.productAmount}</span>
                    </div>
                    <div style="padding: 5px;">
                        <span style="padding-right: 5px; font-size: 1.25rem;">Product ID:</span><span style="padding-right: 5px; font-size: 1.25rem;">${item.productID}</span>
                    </div>
                </div>
            </div>
            `
            cartToSend += cartItem
        })
        cartToSend += `
        <div style="margin: 10px; padding: 10px; border-radius: 5px;">
            <h3 style="text-align: right; font-size: 1.75rem;">Cart Total: ${cartTotal}</h3>
        </div>
        `
        const attachments = cart.map((cartItem)=>{
            return { 
                filename: cartItem.imgName, 
                path: `public/uploads/resized-images/primary-product-images/${cartItem.imgName}`,
                cid: cartItem.imgName
            };
        });
        const options = {
            from: '',
            to: '',
            subject: `NEW QUOTE FROM ${req.body.name}`,
            html: `
            <div style="border: solid 1px black; border-radius: 10px; padding: 15px;">
                <h1>Customer Information</h1>
                <h3>Name:</h3><span>${req.body.name}</span>
                <h3>Company Name:</h3><span>${req.body.companyName}</span>
                <h3>Phone Number:</h3><span>${req.body.phoneNumber}</span>
                <h3>Email:</h3><span>${req.body.email}</span>
                <h3>Event Date:</h3><span>${req.body.eventDate}</span>
                <h3>Event Name:</h3><span>${req.body.eventName}</span>
                <h3>Venue Type:</h3><span>${req.body.venueType}</span>
                <h3>Venue City:</h3><span>${req.body.venueCity}</span>
                <h3>Stairs?</h3><span>${req.body.stairsBoolean}</span>
                <h3>Outside?</h3><span>${req.body.outsideBoolean}</span>
                <h3>Start and end time:</h3><span>${req.body.startEndTime}</span>
                <h3>How did you hear about us:</h3><span>${req.body.hearAboutUs}</span>
                <br>
                <h3>Additional Info:</h3><span>${req.body.additionalInfo}</span>
            </div>
            <div style="border: solid 1px black; padding: 7px; border-radius: 10px; margin-top: 10px;">
                <h1>Customer Cart:</h1>
                ${cartToSend}
            </div>
            `,
            attachments: attachments
        }
        const sent = await transporter.sendMail(options)
        req.flash('success', 'Quote Sent')
        res.redirect('/checkout')
    } catch (error) {
        console.log(error)
        if (req.body.cart !== null || !req.body.cart) {
            req.flash('fail', 'Please add to cart before submitting form')
            res.redirect('/checkout')
        } else {
            req.flash('fail', 'Something went wrong, please try again later')
            res.redirect('/checkout')
        }
    }
}

const sendMessageCustom = async (req,res) => {
    try {
        const options = {
            from: 'automated-dream-party-rentals@outlook.com',
            to: 'akidsdreampartyrentals@gmail.com',
            subject: `NEW MESSAGE FROM ${req.body.name}`,
            html: `
            <div style="border: solid black 1px; border-radius: 10px;">
                <h1 style="padding-left: 10px;">Custom Order from ${req.body.name}</h1>
                <div style="margin: 10px; border-radius: 5px;">
                    <h2 style="padding: 10px;">Name:</h2>
                    <div style="padding-left: 20px;">${req.body.name}</div>
                </div>
                <div style="margin: 10px; border-radius: 5px;">
                    <h2 style="padding: 10px;">Email:</h2>
                    <div style="padding-left: 20px;">${req.body.email}</div>
                </div>
                <div style="margin: 10px; border-radius: 5px;">
                    <h2 style="padding: 10px;">Subject:</h2>
                    <div style="padding-left: 20px;">${req.body.subject}</div>
                </div>
                <div style="margin: 10px; border-radius: 5px;">
                    <h2 style="padding: 10px;">Order:</h2>
                    <div style="padding-left: 20px;">${req.body.query}</div>
                </div>
            </div>
            `,
        }
        const sent = await transporter.sendMail(options)
        req.flash('success', 'Message sent')
        res.redirect('back')
    } catch (error) {
        console.log(error)
        req.flash('fail', 'Something went wrong, please try again later.')
        res.redirect('/customize')
    }
}

module.exports = {sendMessage, sendMessageCustom}