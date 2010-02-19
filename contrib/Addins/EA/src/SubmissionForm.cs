using System;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace TSF.UmlCanvas.Addins {
  class SubmissionForm : Form {
    public SubmissionForm() {
      InitializeComponent();
    }

    private System.ComponentModel.IContainer components = null;

    internal string diagramID {
      get { return this.diagramIDTextBox.Text;  }
      set { this.diagramIDTextBox.Text = value; }
    }
    
    internal string user {
      get { return this.userTextBox.Text;  }
      set { this.userTextBox.Text = value; }
    }
    
    internal string password {
      get { return this.passwordTextBox.Text;  }
      set { this.passwordTextBox.Text = value; }
    }
    
    internal string description {
      get { return this.descriptionTextBox.Text;  }
      set { this.descriptionTextBox.Text = value; }
    }

    protected override void Dispose(bool disposing) {
      if (disposing && (components != null)){
        components.Dispose();
      }
      base.Dispose(disposing);
    }

    private void InitializeComponent() {
      this.diagramIDLabel     = new System.Windows.Forms.Label();
      this.diagramIDTextBox   = new System.Windows.Forms.TextBox();

      this.userLabel          = new System.Windows.Forms.Label();
      this.userTextBox        = new System.Windows.Forms.TextBox();

      this.passwordLabel      = new System.Windows.Forms.Label();
      this.passwordTextBox    = new System.Windows.Forms.TextBox();

      this.descriptionLabel   = new System.Windows.Forms.Label();
      this.descriptionTextBox = new System.Windows.Forms.TextBox();

      this.saveButton         = new System.Windows.Forms.Button();
      this.cancelButton       = new System.Windows.Forms.Button();

      this.SuspendLayout();

      this.diagramIDLabel.AutoSize = true;
      this.diagramIDLabel.Location = new System.Drawing.Point(249, 51);
      this.diagramIDLabel.Name = "DiagramIDLabel";
      this.diagramIDLabel.Size = new System.Drawing.Size(60, 13);
      this.diagramIDLabel.TabIndex = 10;
      this.diagramIDLabel.Text = "Diagram ID";

      this.diagramIDTextBox.Location = new System.Drawing.Point(252, 69);
      this.diagramIDTextBox.Name = "diagramIDTextBox";
      this.diagramIDTextBox.Size = new System.Drawing.Size(100, 20);
      this.diagramIDTextBox.TabIndex = 1;

      this.userLabel.AutoSize = true;
      this.userLabel.Location = new System.Drawing.Point(12, 8);
      this.userLabel.Name = "userLabel";
      this.userLabel.Size = new System.Drawing.Size(29, 13);
      this.userLabel.TabIndex = 11;
      this.userLabel.Text = "User";

      this.userTextBox.Location = new System.Drawing.Point(12, 26);
      this.userTextBox.Name = "userTextBox";
      this.userTextBox.Size = new System.Drawing.Size(140, 20);
      this.userTextBox.TabIndex = 2;

      this.passwordLabel.AutoSize = true;
      this.passwordLabel.Location = new System.Drawing.Point(9, 51);
      this.passwordLabel.Name = "passwordLabel";
      this.passwordLabel.Size = new System.Drawing.Size(53, 13);
      this.passwordLabel.TabIndex = 12;
      this.passwordLabel.Text = "Password";

      this.passwordTextBox.Location = new System.Drawing.Point(12, 69);
      this.passwordTextBox.Name = "passwordTextBox";
      this.passwordTextBox.Size = new System.Drawing.Size(140, 20);
      this.passwordTextBox.TabIndex = 3;
      this.passwordTextBox.UseSystemPasswordChar = true;

      this.descriptionLabel.AutoSize = true;
      this.descriptionLabel.Location = new System.Drawing.Point(9, 94);
      this.descriptionLabel.Name = "descriptionLabel";
      this.descriptionLabel.Size = new System.Drawing.Size(65, 13);
      this.descriptionLabel.TabIndex = 14;
      this.descriptionLabel.Text = "Description";

      this.descriptionTextBox.Location = new System.Drawing.Point(12, 112);
      this.descriptionTextBox.Name = "descriptionTextBox";
      this.descriptionTextBox.Size = new System.Drawing.Size(400, 20);
      this.descriptionTextBox.TabIndex = 5;

      /*
      user        12,08 - 12,26
      password     9,51 - 12,69       id 249,51 - 252,69
      description  9,94 - 12,112
      */

      this.saveButton.Anchor = 
        ((System.Windows.Forms.AnchorStyles)
          ((System.Windows.Forms.AnchorStyles.Bottom 
            | System.Windows.Forms.AnchorStyles.Right)));
      this.saveButton.DialogResult = System.Windows.Forms.DialogResult.OK;
      this.saveButton.Location = new System.Drawing.Point(516, 161);
      this.saveButton.Name = "saveButton";
      this.saveButton.Size = new System.Drawing.Size(75, 23);
      this.saveButton.TabIndex = 6;
      this.saveButton.Text = "Save";
      this.saveButton.UseVisualStyleBackColor = true;

      this.cancelButton.Anchor = 
        ((System.Windows.Forms.AnchorStyles)
          ((System.Windows.Forms.AnchorStyles.Bottom
            | System.Windows.Forms.AnchorStyles.Right)));
      this.cancelButton.DialogResult = 
        System.Windows.Forms.DialogResult.Cancel;
      this.cancelButton.Location = new System.Drawing.Point(426, 161);
      this.cancelButton.Name = "cancelButton";
      this.cancelButton.Size = new System.Drawing.Size(75, 23);
      this.cancelButton.TabIndex = 7;
      this.cancelButton.Text = "Cancel";
      this.cancelButton.UseVisualStyleBackColor = true;

      this.AcceptButton = this.saveButton;
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.CancelButton = this.cancelButton;
      this.ClientSize = new System.Drawing.Size(603, 200);
      this.Controls.Add(this.diagramIDLabel);
      this.Controls.Add(this.diagramIDTextBox);
      this.Controls.Add(this.userLabel);
      this.Controls.Add(this.userTextBox);
      this.Controls.Add(this.passwordLabel);
      this.Controls.Add(this.passwordTextBox);
      this.Controls.Add(this.descriptionLabel);
      this.Controls.Add(this.descriptionTextBox);
      this.Controls.Add(this.saveButton);
      this.Controls.Add(this.cancelButton);
      this.Name = "SubmissionForm";
      this.Text = "SubmissionForm";
      this.ResumeLayout(false);
      this.PerformLayout();
    }

    private System.Windows.Forms.Label   diagramIDLabel;
    private System.Windows.Forms.TextBox diagramIDTextBox;

    private System.Windows.Forms.Label   userLabel;
    private System.Windows.Forms.TextBox userTextBox;

    private System.Windows.Forms.Label   passwordLabel;
    private System.Windows.Forms.TextBox passwordTextBox;

    private System.Windows.Forms.Label   descriptionLabel;    
    private System.Windows.Forms.TextBox descriptionTextBox;

    private System.Windows.Forms.Button saveButton;
    private System.Windows.Forms.Button cancelButton;
  }
}
