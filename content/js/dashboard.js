/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.4492525570417, "KoPercent": 0.5507474429583006};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.774814314652262, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8e8fcbd4-900f-4d2d-b550-cfdd48c0fb18"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4e71a6e6-7c6b-4ee6-8ac6-adc7f6ad68fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5778be5-6539-484f-a042-bc9811ec28d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9e4ea4c-4971-4816-b918-1e7a17ff1e0d"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23d5e639-a50c-4c61-a072-f74f8071af2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a2bdc58-f2cd-4c3c-bd6b-085cd173de9c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3d55de64-e74d-4fd0-8013-dc2c3fd6097d"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=275a8e74-5f02-4484-9773-d7e15e6506e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a8e3f95-2bee-4591-9c3f-01586d05d092"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6a1b666-28a9-4c35-8221-88393ae5b1c7"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/4b1c57a3-bc8c-4b3b-8fbf-5ad89c55784c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8a7cfa5b-b100-40fd-8c9b-b3a49c53cbb1"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1203202-20d2-4e9f-86b4-9e74d0398e2f"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a2bdc58-f2cd-4c3c-bd6b-085cd173de9c"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d55de64-e74d-4fd0-8013-dc2c3fd6097d"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3584905660377358, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e71a6e6-7c6b-4ee6-8ac6-adc7f6ad68fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b480f8a-974f-411d-9ade-a441ef079268"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e8fcbd4-900f-4d2d-b550-cfdd48c0fb18"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ac2560be-fe3e-4482-8475-d2fbd2990809"], "isController": false}, {"data": [0.35, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5778be5-6539-484f-a042-bc9811ec28d1"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9710982658959537, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/156a2721-f5e3-4fa2-953e-e031ae4e012f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23d5e639-a50c-4c61-a072-f74f8071af2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a8e3f95-2bee-4591-9c3f-01586d05d092"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6a1b666-28a9-4c35-8221-88393ae5b1c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=156a2721-f5e3-4fa2-953e-e031ae4e012f"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/132f235d-45ca-4486-b5cd-e5d2b3246284"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/275a8e74-5f02-4484-9773-d7e15e6506e7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b480f8a-974f-411d-9ade-a441ef079268"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1203202-20d2-4e9f-86b4-9e74d0398e2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b1c57a3-bc8c-4b3b-8fbf-5ad89c55784c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1271, 7, 0.5507474429583006, 434.3981117230534, 136, 2229, 178.0, 1127.0, 1280.7999999999997, 1782.28, 4.968686718633943, 686.0395045533264, 3.6240340429316427], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8e8fcbd4-900f-4d2d-b550-cfdd48c0fb18", 3, 0, 0.0, 796.3333333333334, 238, 1476, 675.0, 1476.0, 1476.0, 1476.0, 0.015816945220646386, 0.021804935875467918, 0.010143028022354617], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2112.4528301886794, 1671, 2555, 2078.0, 2429.4, 2503.7, 2555.0, 0.2368598638726141, 285.02328254951715, 1.164638100193957], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4e71a6e6-7c6b-4ee6-8ac6-adc7f6ad68fa", 3, 0, 0.0, 882.0, 235, 2013, 398.0, 2013.0, 2013.0, 2013.0, 0.07668711656441718, 0.03604693890593047, 0.049177610557259714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5778be5-6539-484f-a042-bc9811ec28d1", 3, 0, 0.0, 313.3333333333333, 227, 466, 247.0, 466.0, 466.0, 466.0, 0.08455706192395501, 0.03825986851376871, 0.05422441796555709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9e4ea4c-4971-4816-b918-1e7a17ff1e0d", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 604.6153846153846, 430, 1272, 514.0, 1136.0, 1272.0, 1272.0, 0.08010647999802815, 0.014472362109018758, 0.054447373123659756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 604.6153846153846, 430, 1272, 514.0, 1136.0, 1272.0, 1272.0, 0.08008082002759709, 0.01446772627451705, 0.054429932362507386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 187.42105263157896, 138, 424, 144.0, 422.0, 424.0, 424.0, 0.1044082251700755, 0.03619084449768653, 0.05908380752068931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 174.26315789473685, 139, 426, 145.0, 418.0, 426.0, 426.0, 0.10457027122226137, 0.0777128675782626, 0.052489374422111656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 285.10526315789474, 137, 1129, 145.0, 446.0, 1129.0, 1129.0, 0.10441453670170965, 1.6425218068386025, 0.06101402486439848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 260.5263157894737, 138, 951, 148.0, 444.0, 951.0, 951.0, 0.10456969570218551, 4.978911706371046, 0.061002572276922566], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 368.5, 227, 863, 272.5, 858.5, 863.0, 863.0, 0.07152673822746525, 0.18022882010258978, 0.04624091865877148], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23d5e639-a50c-4c61-a072-f74f8071af2d", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 188.57894736842104, 139, 427, 145.0, 424.0, 427.0, 427.0, 0.10845677426720324, 0.08060117697006022, 0.05444021677084225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 186.0, 138, 426, 143.0, 423.0, 426.0, 426.0, 0.10828061776941927, 0.04609272596455235, 0.06079653929446629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 776.0, 687, 992, 712.5, 992.0, 992.0, 992.0, 0.1063094668580237, 31.25851306277574, 0.06062961781746665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a2bdc58-f2cd-4c3c-bd6b-085cd173de9c", 3, 0, 0.0, 324.0, 256, 430, 286.0, 430.0, 430.0, 430.0, 0.02833530106257379, 0.02841831463990555, 0.018170749704840613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1072.75, 974, 1270, 1023.5, 1270.0, 1270.0, 1270.0, 0.10621348911311737, 95.57108420738184, 0.06047115639936272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 354.25, 151, 439, 413.5, 439.0, 439.0, 439.0, 0.10789523372805007, 0.1909239878078386, 0.05974277101934022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 144.76923076923077, 139, 150, 145.0, 149.6, 150.0, 150.0, 0.06643873071360307, 0.04937487702446478, 0.03334912850272654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 164.84615384615384, 136, 445, 143.0, 326.5999999999999, 445.0, 445.0, 0.06644042848965574, 0.025454190602256933, 0.03746257934520403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 252.9230769230769, 138, 996, 146.0, 769.1999999999998, 996.0, 996.0, 0.06644076805527871, 4.6152626342870136, 0.03862069284944011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 254.4615384615385, 138, 1026, 147.0, 785.9999999999998, 1026.0, 1026.0, 0.06643907026187215, 1.5192447315094957, 0.03868458786055972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 145.5, 141, 150, 145.5, 150.0, 150.0, 150.0, 0.10876658690450294, 0.08083141858820969, 0.06107498776375897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 864.4666666666668, 142, 1438, 998.0, 1432.0, 1438.0, 1438.0, 0.09957779016968055, 59.74246019792746, 0.05283587173716774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 309.1578947368421, 137, 1326, 149.0, 984.0, 1326.0, 1326.0, 0.10828678901174058, 10.282603139604468, 0.0626812200786504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 716.2666666666665, 145, 1185, 952.0, 1158.0, 1185.0, 1185.0, 0.09957779016968055, 19.528397511219097, 0.052933115672880324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 246.89473684210526, 138, 993, 144.0, 681.0, 993.0, 993.0, 0.10845615517221696, 3.3829668894774696, 0.0628851709754204], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 450.46153846153845, 242, 773, 452.0, 699.8, 773.0, 773.0, 0.08011585985887283, 0.014474056712784643, 0.055236129941761934], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d55de64-e74d-4fd0-8013-dc2c3fd6097d", 3, 0, 0.0, 741.6666666666666, 361, 999, 865.0, 999.0, 999.0, 999.0, 0.0188534583527105, 0.02599101436319302, 0.012090271144153541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 402.1538461538462, 284, 1174, 295.0, 932.7999999999997, 1174.0, 1174.0, 0.0663881767763944, 6.204461859992442, 0.14800194728012744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 587.5714285714287, 181, 1357, 493.0, 1150.4, 1337.9999999999998, 1357.0, 0.09017635919390923, 0.05539153313766495, 0.04077309990896481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 164.5333333333333, 139, 431, 145.0, 267.80000000000007, 431.0, 431.0, 0.09957316304109716, 0.07399919636159662, 0.04998106035461322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 278.8, 139, 443, 152.0, 443.0, 443.0, 443.0, 0.0995744850339549, 0.1263480933145691, 0.051213439568245034], "isController": false}, {"data": ["login", 21, 0, 0.0, 2617.9523809523807, 1627, 4188, 2586.0, 3702.0, 4142.999999999999, 4188.0, 0.09152360655309022, 20.98325941984929, 0.1669973842226377], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=275a8e74-5f02-4484-9773-d7e15e6506e7", 1, 0, 0.0, 773.0, 773, 773, 773.0, 773.0, 773.0, 773.0, 1.29366106080207, 0.23371806274256143, 0.8919186610608021], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 181.3684210526316, 142, 452, 150.0, 432.0, 452.0, 452.0, 0.109810720994076, 0.08889949971102441, 0.03903427972836295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a8e3f95-2bee-4591-9c3f-01586d05d092", 3, 0, 0.0, 549.6666666666666, 259, 963, 427.0, 963.0, 963.0, 963.0, 0.024876653260914632, 0.02940336197603549, 0.01595280173307351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6a1b666-28a9-4c35-8221-88393ae5b1c7", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1059.3999999999999, 295, 1588, 1166.0, 1582.0, 1588.0, 1588.0, 0.09947477319751712, 79.38899667049644, 0.20675339416215713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b1c57a3-bc8c-4b3b-8fbf-5ad89c55784c", 3, 0, 0.0, 1011.0, 635, 1544, 854.0, 1544.0, 1544.0, 1544.0, 0.08326625773682313, 0.03767581323378389, 0.05339665616586638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a7cfa5b-b100-40fd-8c9b-b3a49c53cbb1", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.5991293386491557, 1.1194740853658536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 507.36842105263173, 284, 1268, 560.0, 860.0, 1268.0, 1268.0, 0.10432739033269456, 6.722220859026241, 0.23322984387955129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1218.75, 1116, 1414, 1172.5, 1414.0, 1414.0, 1414.0, 0.10581450716893286, 126.59093764880166, 0.23859931352838473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1203202-20d2-4e9f-86b4-9e74d0398e2f", 3, 0, 0.0, 497.0, 239, 915, 337.0, 915.0, 915.0, 915.0, 0.021726850041281016, 0.025807706966352352, 0.013932908392357942], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1065.8695652173913, 171, 2073, 1063.0, 1579.8000000000004, 1994.9999999999989, 2073.0, 0.09613576041296579, 0.030434282848126396, 0.04337375128006855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a2bdc58-f2cd-4c3c-bd6b-085cd173de9c", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 516.2105263157895, 285, 1750, 297.0, 1127.0, 1750.0, 1750.0, 0.1081936780725581, 13.77500266035442, 0.2404161844218187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 176.65, 140, 427, 151.5, 390.3000000000005, 426.45, 427.0, 0.11121243799906581, 0.08634168770435285, 0.039532546319980426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d55de64-e74d-4fd0-8013-dc2c3fd6097d", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 427.84615384615387, 285, 593, 343.0, 589.4, 593.0, 593.0, 0.08395546485495078, 0.13011457297344425, 0.18881780816499186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 144.7142857142857, 142, 148, 145.0, 148.0, 148.0, 148.0, 0.035984906901905145, 0.026742689601904113, 0.018062736472245353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 144.85714285714286, 141, 150, 144.0, 150.0, 150.0, 150.0, 0.035984166966534725, 0.0096285759265923, 0.020522220223101836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 222.14285714285717, 140, 425, 143.0, 425.0, 425.0, 425.0, 0.03593502946672416, 0.009685613410952998, 0.021125866932585887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 184.14285714285714, 138, 427, 144.0, 427.0, 427.0, 427.0, 0.03598472191520971, 0.009699007078708868, 0.02119022198717916], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1370.9056603773581, 1099, 1976, 1186.0, 1815.2, 1890.6999999999996, 1976.0, 0.23727660184090826, 283.86530649533506, 0.4685286024631998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1065.8695652173913, 171, 2073, 1063.0, 1579.8000000000004, 1994.9999999999989, 2073.0, 0.09360323623015002, 0.029632546252207816, 0.04223114759602471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 187.57142857142856, 144, 432, 148.0, 432.0, 432.0, 432.0, 0.04335385415763461, 0.011685218503424955, 0.025529662165091477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 226.71428571428572, 138, 440, 148.0, 440.0, 440.0, 440.0, 0.04327880204275946, 0.01166498961308751, 0.025443201982169136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 313.15, 138, 1244, 146.0, 938.9000000000012, 1231.4999999999998, 1244.0, 0.11401403512772422, 10.286660233187206, 0.06604797425563087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 271.2, 137, 952, 149.0, 706.7000000000006, 941.1999999999998, 952.0, 0.11383622382478328, 3.374777130018043, 0.06605613691082639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e71a6e6-7c6b-4ee6-8ac6-adc7f6ad68fa", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.6022135416666667, 2.2981770833333335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 145.34999999999997, 138, 154, 145.5, 149.9, 153.8, 154.0, 0.11400363671601124, 0.08472340580164507, 0.057224481710966585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 142.57142857142858, 137, 148, 142.0, 148.0, 148.0, 148.0, 0.043356270865205354, 0.011601189665103775, 0.02472662322781243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 199.55, 137, 430, 145.0, 428.8, 429.95, 430.0, 0.11401208528103979, 0.04763122078440315, 0.06406499401436552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 193.42857142857142, 145, 431, 150.0, 431.0, 431.0, 431.0, 0.04335304864831387, 0.03221842775524107, 0.021761198247298174], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 735.0769230769231, 420, 2013, 635.0, 1607.3999999999996, 2013.0, 2013.0, 0.07940289026520565, 0.014345248729553756, 0.05404669386215658], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 153.0, 151, 157, 152.0, 157.0, 157.0, 157.0, 0.04377079112578475, 0.03445240004627198, 0.015559148407993797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b480f8a-974f-411d-9ade-a441ef079268", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e8fcbd4-900f-4d2d-b550-cfdd48c0fb18", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1263.0, 912, 2229, 1200.0, 1838.4, 2194.6999999999994, 2229.0, 0.0923710324442255, 0.047809225776796395, 0.04248706668088888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 423.28571428571433, 290, 872, 298.0, 872.0, 872.0, 872.0, 0.04323843526279703, 0.06701112965044813, 0.097244254306857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac2560be-fe3e-4482-8475-d2fbd2990809", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.6082589285714285, 1.1365327380952381], "isController": false}, {"data": ["addBook", 60, 2, 3.3333333333333335, 1334.2500000000002, 733, 3503, 1128.5, 2240.6, 2306.3999999999996, 3503.0, 0.2920830879024053, 94.27118575997586, 1.0628040250266526], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5778be5-6539-484f-a042-bc9811ec28d1", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 263.98113207547163, 139, 699, 150.0, 597.2, 605.6, 699.0, 0.23835436548269007, 0.17713639856672572, 0.11522012784563632], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 807.5849056603773, 680, 1139, 715.0, 1023.6, 1034.0, 1139.0, 0.2382836384562817, 70.06330146757993, 0.11983991582518073], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 225.69811320754715, 138, 557, 149.0, 432.6, 445.5, 557.0, 0.23888723620989624, 0.422718429699543, 0.11617758167239095], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1102.490566037736, 949, 1395, 1028.0, 1323.0, 1334.6, 1395.0, 0.23796268026795495, 214.11923799887978, 0.11944611099387584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 162.07692307692307, 142, 257, 152.0, 225.79999999999995, 257.0, 257.0, 0.08371164557777133, 0.06253848522167488, 0.02975687401397341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 2, 1.1560693641618498, 223.72254335260118, 138, 1782, 154.0, 378.0, 434.7999999999999, 948.0199999999897, 0.7117408440505871, 1.459118549591469, 0.3458101400442678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 155.14285714285717, 143, 183, 149.0, 183.0, 183.0, 183.0, 0.0368657769725824, 0.028549376112556486, 0.013104631658222649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/156a2721-f5e3-4fa2-953e-e031ae4e012f", 3, 0, 0.0, 306.0, 232, 430, 256.0, 430.0, 430.0, 430.0, 0.054450413823145055, 0.03500636956403369, 0.03491774584361841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23d5e639-a50c-4c61-a072-f74f8071af2d", 3, 0, 0.0, 539.0, 229, 904, 484.0, 904.0, 904.0, 904.0, 0.016678712403402456, 0.022992951506643686, 0.010695658670150664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 166.47368421052633, 140, 452, 152.0, 170.0, 452.0, 452.0, 0.10394782913165265, 0.0843560996175814, 0.036950204886642156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a8e3f95-2bee-4591-9c3f-01586d05d092", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6a1b666-28a9-4c35-8221-88393ae5b1c7", 3, 0, 0.0, 495.33333333333337, 267, 813, 406.0, 813.0, 813.0, 813.0, 0.030631936857367495, 0.030721678859879312, 0.019643527216475897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=156a2721-f5e3-4fa2-953e-e031ae4e012f", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 370.0, 287, 576, 293.0, 576.0, 576.0, 576.0, 0.03590811626022099, 0.055650566899385454, 0.08075819506571184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/132f235d-45ca-4486-b5cd-e5d2b3246284", 2, 0, 0.0, 543.5, 224, 863, 543.5, 863.0, 863.0, 863.0, 0.012606842994377348, 0.024918213106073978, 0.007836187076094904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 518.05, 286, 1392, 561.0, 1084.4000000000012, 1379.35, 1392.0, 0.11373588253358052, 13.765407213556179, 0.2528846263207579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 148.76923076923077, 142, 155, 149.0, 153.8, 155.0, 155.0, 0.06460269343537245, 0.053562194068975805, 0.022964238682105054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/275a8e74-5f02-4484-9773-d7e15e6506e7", 3, 0, 0.0, 919.3333333333334, 294, 2044, 420.0, 2044.0, 2044.0, 2044.0, 0.02405079527963058, 0.02412125659392637, 0.01542319879585685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b480f8a-974f-411d-9ade-a441ef079268", 3, 0, 0.0, 477.0, 249, 849, 333.0, 849.0, 849.0, 849.0, 0.02339984088108201, 0.027657819739325774, 0.015005757335850118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 151.33333333333331, 142, 161, 150.0, 160.4, 161.0, 161.0, 0.1058342917216417, 0.0821662714049855, 0.03762078338542733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1203202-20d2-4e9f-86b4-9e74d0398e2f", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b1c57a3-bc8c-4b3b-8fbf-5ad89c55784c", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5846733414239482, 2.2312398867313914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 145.76923076923077, 139, 153, 144.0, 152.2, 153.0, 153.0, 0.084065131076939, 0.062474184325732984, 0.04219675524760415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 234.53846153846152, 138, 442, 147.0, 435.2, 442.0, 442.0, 0.0840390458336027, 0.02248701031094447, 0.04792851832697653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 215.15384615384616, 138, 444, 149.0, 437.6, 444.0, 444.0, 0.08404393558355584, 0.022652467012755282, 0.049408641817676374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 249.9230769230769, 137, 442, 143.0, 435.6, 442.0, 442.0, 0.08407111122608014, 0.022659791697654415, 0.049506718817701495], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 71.42857142857143, 0.3933910306845004], "isController": false}, {"data": ["401/Unauthorized", 2, 28.571428571428573, 0.15735641227380015], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1271, 7, "406/Not Acceptable", 5, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
