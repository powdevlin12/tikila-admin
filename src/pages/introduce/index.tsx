import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './introduce.css';
import { CompanyService } from '../../services/companyService';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Introduce = () => {
	const [introContent, setIntroContent] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [uploading, setUploading] = useState(false);
	const quillRef = useRef<ReactQuill>(null);
	const { isAuthenticated } = useAuthStore();
	const navigate = useNavigate();

	// Check authentication
	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
		}
	}, [isAuthenticated, navigate]);

	// Fetch current intro content
	useEffect(() => {
		fetchIntroContent();
	}, []);

	const fetchIntroContent = async () => {
		try {
			const data = await CompanyService.getIntroDetail();
			if (data.success && data.data?.intro_text_detail) {
				setIntroContent(data.data.intro_text_detail);
			}
		} catch (error) {
			console.error('Error fetching intro content:', error);
		}
	};

	const handleSave = async () => {
		setLoading(true);
		setMessage('');
		try {
			const data = await CompanyService.updateIntroDetail(introContent);
			if (data.success) {
				setMessage('Cập nhật nội dung giới thiệu thành công!');
			} else {
				setMessage('Có lỗi xảy ra khi cập nhật!');
			}
		} catch (error) {
			console.error('Error saving intro content:', error);
			setMessage('Có lỗi xảy ra khi cập nhật!');
		} finally {
			setLoading(false);
		}
	};

	// Custom image handler for ReactQuill
	const imageHandler = () => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();

		input.onchange = async () => {
			const file = input.files?.[0];
			if (file) {
				try {
					setUploading(true);
					setMessage('Đang tải ảnh lên...');

					const uploadResult = await CompanyService.uploadEditorImage(file);

					if (uploadResult.url && uploadResult.url.length > 0) {
						// Get Quill editor instance
						const quill = quillRef.current?.getEditor();
						if (quill) {
							// Get current selection range
							const range = quill.getSelection();
							const index = range ? range.index : quill.getLength();

							// Insert image at current cursor position
							quill.insertEmbed(index, 'image', uploadResult.url[0].url);

							// Move cursor to after the image
							quill.setSelection(index + 1);
						}

						setMessage('Tải ảnh lên thành công!');
						setTimeout(() => setMessage(''), 2000);
					} else {
						setMessage('Có lỗi xảy ra khi tải ảnh lên!');
						setTimeout(() => setMessage(''), 3000);
					}
				} catch (error) {
					console.error('Error uploading image:', error);
					setMessage('Có lỗi xảy ra khi tải ảnh lên!');
					setTimeout(() => setMessage(''), 3000);
				} finally {
					setUploading(false);
				}
			}
		};
	};

	const modules = {
		toolbar: {
			container: [
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				['bold', 'italic', 'underline', 'strike'],
				[{ color: [] }, { background: [] }],
				[{ script: 'sub' }, { script: 'super' }],
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ indent: '-1' }, { indent: '+1' }],
				[{ align: [] }],
				['blockquote', 'code-block'],
				['link', 'image', 'video'],
				['clean'],
			],
			handlers: {
				image: imageHandler,
			},
		},
	};

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'color',
		'background',
		'script',
		'list',
		'bullet',
		'indent',
		'align',
		'blockquote',
		'code-block',
		'link',
		'image',
		'video',
	];

	return (
		<div className='introduce-editor'>
			<div className='editor-header'>
				<h2>Chỉnh sửa nội dung giới thiệu</h2>
				<button
					onClick={handleSave}
					disabled={loading || uploading}
					className='save-btn'
				>
					{loading
						? 'Đang lưu...'
						: uploading
						? 'Đang tải ảnh...'
						: 'Lưu thay đổi'}
				</button>
			</div>

			{message && (
				<div
					className={`message ${
						message.includes('thành công') ? 'success' : 'error'
					}`}
				>
					{message}
				</div>
			)}

			<div className={`editor-container ${uploading ? 'uploading' : ''}`}>
				<ReactQuill
					ref={quillRef}
					theme='snow'
					value={introContent}
					onChange={setIntroContent}
					modules={modules}
					formats={formats}
					placeholder='Nhập nội dung giới thiệu công ty...'
				/>
			</div>
		</div>
	);
};

export default Introduce;
