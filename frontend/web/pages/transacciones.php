<section id="transacciones" class="">
	<h2>Buscar</h2>
	<input type="text" name="buscar" class="buscar" placeholder="Buscar transacción ..." />

	<div class="container">
		<div class="item payment">
			<div class="item-status">
				<em class="status pending">
					<?php
					$svgFile = 'img/icons/clock-rotate-left-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4568</span></h4>
				<span class="item-memo">Funda iPhone XS</span>
			</div>
			<div class="item-price">14,99 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4567</span></h4>
				<span class="item-memo">Cable Lightning USB 1 M</span>
			</div>
			<div class="item-price">7,00 €</div>
		</div>
		<div class="item refund">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Devolución <span>4566</span></h4>
				<span class="item-memo">Llavero Bitcoin dorado</span>
			</div>
			<div class="item-price">15,33 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4566</span></h4>
				<span class="item-memo">Llavero Bitcoin dorado</span>
			</div>
			<div class="item-price">15,33 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4565</span></h4>
				<span class="item-memo">Batería original iPhone SE 2020</span>
			</div>
			<div class="item-price">45,00 €</div>
		</div>
		<div class="item cancelled">
			<div class="item-status">
				<em class="status cancelled">
					<?php
					$svgFile = 'img/icons/circle-xmark-regular.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4564</span></h4>
				<span class="item-memo">Pantalla OLED iPhone 11</span>
			</div>
			<div class="item-price">89,00 €</div>
		</div>
		

		<div class="item payment">
			<div class="item-status">
				<em class="status pending">
					<?php
					$svgFile = 'img/icons/clock-rotate-left-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4568</span></h4>
				<span class="item-memo">Funda iPhone XS</span>
			</div>
			<div class="item-price">14,99 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4567</span></h4>
				<span class="item-memo">Cable Lightning USB 1 M</span>
			</div>
			<div class="item-price">7,00 €</div>
		</div>
		<div class="item refund">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Devolución <span>4566</span></h4>
				<span class="item-memo">Llavero Bitcoin dorado</span>
			</div>
			<div class="item-price">15,33 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4566</span></h4>
				<span class="item-memo">Llavero Bitcoin dorado</span>
			</div>
			<div class="item-price">15,33 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4565</span></h4>
				<span class="item-memo">Batería original iPhone SE 2020</span>
			</div>
			<div class="item-price">45,00 €</div>
		</div>
		<div class="item cancelled">
			<div class="item-status">
				<em class="status cancelled">
					<?php
					$svgFile = 'img/icons/circle-xmark-regular.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4564</span></h4>
				<span class="item-memo">Pantalla OLED iPhone 11</span>
			</div>
			<div class="item-price">89,00 €</div>
		</div>
		

		<div class="item payment">
			<div class="item-status">
				<em class="status pending">
					<?php
					$svgFile = 'img/icons/clock-rotate-left-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4568</span></h4>
				<span class="item-memo">Funda iPhone XS</span>
			</div>
			<div class="item-price">14,99 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4567</span></h4>
				<span class="item-memo">Cable Lightning USB 1 M</span>
			</div>
			<div class="item-price">7,00 €</div>
		</div>
		<div class="item refund">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Devolución <span>4566</span></h4>
				<span class="item-memo">Llavero Bitcoin dorado</span>
			</div>
			<div class="item-price">15,33 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4566</span></h4>
				<span class="item-memo">Llavero Bitcoin dorado</span>
			</div>
			<div class="item-price">15,33 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4565</span></h4>
				<span class="item-memo">Batería original iPhone SE 2020</span>
			</div>
			<div class="item-price">45,00 €</div>
		</div>
		<div class="item cancelled">
			<div class="item-status">
				<em class="status cancelled">
					<?php
					$svgFile = 'img/icons/circle-xmark-regular.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4564</span></h4>
				<span class="item-memo">Pantalla OLED iPhone 11</span>
			</div>
			<div class="item-price">89,00 €</div>
		</div>
		

		<div class="item payment">
			<div class="item-status">
				<em class="status pending">
					<?php
					$svgFile = 'img/icons/clock-rotate-left-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4568</span></h4>
				<span class="item-memo">Funda iPhone XS</span>
			</div>
			<div class="item-price">14,99 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4567</span></h4>
				<span class="item-memo">Cable Lightning USB 1 M</span>
			</div>
			<div class="item-price">7,00 €</div>
		</div>
		<div class="item refund">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Devolución <span>4566</span></h4>
				<span class="item-memo">Llavero Bitcoin dorado</span>
			</div>
			<div class="item-price">15,33 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4566</span></h4>
				<span class="item-memo">Llavero Bitcoin dorado</span>
			</div>
			<div class="item-price">15,33 €</div>
		</div>
		<div class="item payment">
			<div class="item-status">
				<em class="status confirmed">
					<?php
					$svgFile = 'img/icons/circle-check-solid.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4565</span></h4>
				<span class="item-memo">Batería original iPhone SE 2020</span>
			</div>
			<div class="item-price">45,00 €</div>
		</div>
		<div class="item cancelled">
			<div class="item-status">
				<em class="status cancelled">
					<?php
					$svgFile = 'img/icons/circle-xmark-regular.svg';
					if (file_exists($svgFile)) {
						$svgContent = file_get_contents($svgFile);
						echo $svgContent;
					} else {
						echo 'Error: SVG file not found.';
					}
					?>
				</em>
			</div>
			<div class="item-info">
				<h4>Venta <span>4564</span></h4>
				<span class="item-memo">Pantalla OLED iPhone 11</span>
			</div>
			<div class="item-price">89,00 €</div>
		</div>
		
	</div>
</section>
