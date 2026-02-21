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

    var data = {"OkPercent": 68.39546191247975, "KoPercent": 31.60453808752026};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5171800947867299, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/119fc4f7-f038-4fd7-84f7-678e6edc6315"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67bf3919-67cc-4bae-82b7-7558b2f23d60"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/348d6ab7-a26a-47bb-b2a9-029469355c8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36d90bdc-6115-484b-aaaa-e5935b586d88"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5493f3d-75d9-4a2e-948d-581095b6c0b6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/92c08565-65a2-4abd-a456-aa0901cb0c7f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=682445c4-5b20-4554-b6e7-201d1992fd86"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c57084e-2f66-4b7b-94bb-be7b1dacc739"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c57084e-2f66-4b7b-94bb-be7b1dacc739"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=348d6ab7-a26a-47bb-b2a9-029469355c8f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/682445c4-5b20-4554-b6e7-201d1992fd86"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5493f3d-75d9-4a2e-948d-581095b6c0b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26fb5acd-29dd-4c42-8347-a40c2acab27d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91911df5-aaaa-42eb-90e7-ec5a7d6b0ee3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67bf3919-67cc-4bae-82b7-7558b2f23d60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db22aa9e-0c28-4290-ac8e-a500cbd8386b"], "isController": false}, {"data": [0.8125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51307ffb-c1cd-4342-8984-ed9808b26041"], "isController": false}, {"data": [0.9497041420118343, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db22aa9e-0c28-4290-ac8e-a500cbd8386b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51307ffb-c1cd-4342-8984-ed9808b26041"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff92ea1e-823e-4a1f-904c-ecd320ec6634"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=430c77f3-edc2-4923-a7cb-1915a7f3f71f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26fb5acd-29dd-4c42-8347-a40c2acab27d"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4dadf157-16d3-43a9-88cd-f86980642df6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4dadf157-16d3-43a9-88cd-f86980642df6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92c08565-65a2-4abd-a456-aa0901cb0c7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b85a2360-8c0f-45bc-b3b7-4f0c11bbbb5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0800486-e92e-42c6-9d4f-bea6d4f05a84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/430c77f3-edc2-4923-a7cb-1915a7f3f71f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08a5147f-d471-4e32-9e9f-1e22c8a94b0b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e0800486-e92e-42c6-9d4f-bea6d4f05a84"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b85a2360-8c0f-45bc-b3b7-4f0c11bbbb5b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=119fc4f7-f038-4fd7-84f7-678e6edc6315"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff92ea1e-823e-4a1f-904c-ecd320ec6634"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 617, 195, 31.60453808752026, 318.67423014586694, 128, 2126, 144.0, 742.2000000000003, 1122.4000000000003, 1519.5000000000036, 2.4511751338810406, 2.5707062349036214, 1.178609244893054], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/119fc4f7-f038-4fd7-84f7-678e6edc6315", 3, 0, 0.0, 488.66666666666663, 233, 810, 423.0, 810.0, 810.0, 810.0, 0.0204096905210594, 0.024123563242827693, 0.013088245548986658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67bf3919-67cc-4bae-82b7-7558b2f23d60", 3, 0, 0.0, 297.6666666666667, 228, 434, 231.0, 434.0, 434.0, 434.0, 0.03221476510067114, 0.026856124161073826, 0.020658557046979865], "isController": false}, {"data": ["see books", 59, 59, 100.0, 761.2881355932202, 527, 1318, 801.0, 999.0, 1032.0, 1318.0, 0.2605098044410299, 1.674164429980263, 0.43732065804114284], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 158.9, 134, 405, 142.5, 182.5, 393.89999999999986, 405.0, 0.08644163028914725, 0.06711044539050007, 0.030727298266845313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 231.7058823529412, 131, 427, 144.0, 424.6, 427.0, 427.0, 0.08541254258066462, 0.04245603923199052, 0.04287309266256017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/348d6ab7-a26a-47bb-b2a9-029469355c8f", 3, 0, 0.0, 315.0, 242, 418, 285.0, 418.0, 418.0, 418.0, 0.07577479730241721, 0.03561810133616226, 0.04859256207218812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36d90bdc-6115-484b-aaaa-e5935b586d88", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5493f3d-75d9-4a2e-948d-581095b6c0b6", 1, 0, 0.0, 851.0, 851, 851, 851.0, 851.0, 851.0, 851.0, 1.1750881316098707, 0.21229619565217392, 0.8101681844888367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 135.0526315789474, 128, 149, 134.0, 140.0, 149.0, 149.0, 0.09350347685296825, 0.046477802459141446, 0.046934362404712576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92c08565-65a2-4abd-a456-aa0901cb0c7f", 3, 0, 0.0, 876.0, 216, 2126, 286.0, 2126.0, 2126.0, 2126.0, 0.035227392820657344, 0.02902361042613403, 0.022590483026267892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 2.1685431985294117, 4.545323988970588], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 267.3898305084746, 128, 858, 139.0, 556.0, 628.0, 858.0, 0.2505861166796915, 0.1245589193261357, 0.12113293726215554], "isController": false}, {"data": ["deleteBook", 16, 1, 6.25, 627.1875, 133, 1202, 495.0, 1124.3000000000002, 1202.0, 1202.0, 0.07904982114977965, 0.014845965556510741, 0.0534927592216557], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 1, 6.25, 627.1875, 133, 1202, 495.0, 1124.3000000000002, 1202.0, 1202.0, 0.07945375543140906, 0.014921826505276226, 0.05376610024829299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=682445c4-5b20-4554-b6e7-201d1992fd86", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 960.4000000000001, 242, 1723, 1025.0, 1488.0000000000002, 1665.9999999999998, 1723.0, 0.1044757407330018, 0.03284456099293744, 0.0471365158385223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c57084e-2f66-4b7b-94bb-be7b1dacc739", 3, 0, 0.0, 425.66666666666663, 228, 737, 312.0, 737.0, 737.0, 737.0, 0.02737800815864643, 0.02729779915036915, 0.01755686070069449], "isController": false}, {"data": ["deleteAccount", 16, 1, 6.25, 638.2500000000002, 132, 2126, 496.0, 1204.8000000000009, 2126.0, 2126.0, 0.08033056025545118, 0.016101413566827497, 0.05425156550455123], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 206.5, 140, 518, 142.0, 518.0, 518.0, 518.0, 0.038242136460690274, 0.03010074412823863, 0.013593884445010994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c57084e-2f66-4b7b-94bb-be7b1dacc739", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1218.4583333333335, 878, 1848, 1200.0, 1613.5, 1799.75, 1848.0, 0.10112245929821012, 0.05233877287895641, 0.04651238118111032], "isController": false}, {"data": ["goToProfile", 16, 1, 6.25, 239.125, 130, 414, 221.5, 342.6000000000001, 414.0, 414.0, 0.07930646496389077, 0.14601799451298395, 0.05084926845981889], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=348d6ab7-a26a-47bb-b2a9-029469355c8f", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, 100.0, 183.83333333333331, 133, 410, 139.5, 410.0, 410.0, 410.0, 0.03763525168574565, 0.01870736631644974, 0.018891132193821544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/682445c4-5b20-4554-b6e7-201d1992fd86", 3, 0, 0.0, 358.0, 208, 463, 403.0, 463.0, 463.0, 463.0, 0.038851548234197134, 0.02497780200603494, 0.024914567064247512], "isController": false}, {"data": ["addBook", 55, 55, 100.0, 818.509090909091, 539, 1637, 772.0, 1006.8, 1139.3999999999987, 1637.0, 0.2576800363563106, 0.8690616098326016, 0.5036473437873343], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b5493f3d-75d9-4a2e-948d-581095b6c0b6", 3, 0, 0.0, 441.0, 338, 571, 414.0, 571.0, 571.0, 571.0, 0.024298974583272587, 0.028720565335892824, 0.015582350237319985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26fb5acd-29dd-4c42-8347-a40c2acab27d", 3, 0, 0.0, 299.6666666666667, 202, 490, 207.0, 490.0, 490.0, 490.0, 0.04174493842621582, 0.025968286892089337, 0.026770028873582413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91911df5-aaaa-42eb-90e7-ec5a7d6b0ee3", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.6584246134020618, 1.2302673969072164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67bf3919-67cc-4bae-82b7-7558b2f23d60", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 0.22498637920298878, 0.8585966687422166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 155.1578947368421, 129, 422, 140.0, 159.0, 422.0, 422.0, 0.09565764631843927, 0.0714629877281309, 0.03400330396475771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db22aa9e-0c28-4290-ac8e-a500cbd8386b", 3, 0, 0.0, 369.3333333333333, 305, 456, 347.0, 456.0, 456.0, 456.0, 0.04590033507244603, 0.029509492763047172, 0.029434785186431865], "isController": false}, {"data": ["deleteBooks", 16, 1, 6.25, 511.1875, 136, 1231, 426.0, 965.0000000000002, 1231.0, 1231.0, 0.07956359368861793, 0.014942454698478843, 0.054500867429648374], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51307ffb-c1cd-4342-8984-ed9808b26041", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 5, 2.9585798816568047, 207.73964497041422, 128, 1200, 143.0, 345.0, 494.5, 1048.8000000000025, 0.6821447599980625, 1.5710780523455286, 0.3240282212167202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 140.16666666666666, 132, 152, 139.5, 150.5, 152.0, 152.0, 0.06305302759620841, 0.048829151253704364, 0.02241338090333971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db22aa9e-0c28-4290-ac8e-a500cbd8386b", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51307ffb-c1cd-4342-8984-ed9808b26041", 3, 0, 0.0, 312.3333333333333, 223, 434, 280.0, 434.0, 434.0, 434.0, 0.034138237101436084, 0.028459643625253193, 0.02189203355788707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 6, 100.0, 179.0, 131, 391, 138.0, 391.0, 391.0, 391.0, 0.041154521510096576, 0.020456690867811676, 0.020657640679872694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff92ea1e-823e-4a1f-904c-ecd320ec6634", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 0.5681259827044025, 2.168091588050314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 176.875, 132, 421, 139.5, 416.8, 421.0, 421.0, 0.09820228443064156, 0.07969345543150698, 0.03490784329370462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=430c77f3-edc2-4923-a7cb-1915a7f3f71f", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26fb5acd-29dd-4c42-8347-a40c2acab27d", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 548.7083333333333, 172, 1337, 433.0, 1187.0, 1331.0, 1337.0, 0.10051640302051791, 0.06174298583975173, 0.045448334568847455], "isController": false}, {"data": ["login", 24, 6, 25.0, 2101.0833333333326, 1423, 3355, 2087.0, 2591.5, 3184.0, 3355.0, 0.1001602564102564, 0.14980022723858172, 0.1502403846153846], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, 100.0, 201.83333333333334, 131, 412, 139.5, 405.40000000000003, 412.0, 412.0, 0.06059106584734081, 0.030118020035445774, 0.03041387484915349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4dadf157-16d3-43a9-88cd-f86980642df6", 3, 0, 0.0, 346.3333333333333, 215, 482, 342.0, 482.0, 482.0, 482.0, 0.04761678015332604, 0.030613001563417615, 0.03053550029363681], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 201.47058823529412, 131, 419, 141.0, 405.4, 419.0, 419.0, 0.08628609423456622, 0.06985466027388221, 0.030672010059943456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, 100.0, 189.65000000000003, 131, 414, 140.5, 393.0, 412.95, 414.0, 0.08631739770309405, 0.04290581585046374, 0.04332728751893588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4dadf157-16d3-43a9-88cd-f86980642df6", 1, 0, 0.0, 1231.0, 1231, 1231, 1231.0, 1231.0, 1231.0, 1231.0, 0.8123476848090982, 0.14676203290008122, 0.5600756498781478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92c08565-65a2-4abd-a456-aa0901cb0c7f", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b85a2360-8c0f-45bc-b3b7-4f0c11bbbb5b", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0800486-e92e-42c6-9d4f-bea6d4f05a84", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 141.33333333333334, 134, 148, 142.0, 148.0, 148.0, 148.0, 0.0402357816806486, 0.03335954945983463, 0.014302563019293056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 136.72222222222223, 131, 143, 135.0, 142.1, 143.0, 143.0, 0.08563110121596162, 0.04256467824113718, 0.04298279885254324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 157.05555555555554, 132, 426, 139.5, 195.60000000000036, 426.0, 426.0, 0.08531088709104093, 0.06623257347400151, 0.030325354395643458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/430c77f3-edc2-4923-a7cb-1915a7f3f71f", 3, 0, 0.0, 359.3333333333333, 220, 502, 356.0, 502.0, 502.0, 502.0, 0.0316302216224195, 0.026368814314783964, 0.020283703319064587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08a5147f-d471-4e32-9e9f-1e22c8a94b0b", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0800486-e92e-42c6-9d4f-bea6d4f05a84", 3, 0, 0.0, 786.3333333333334, 207, 1392, 760.0, 1392.0, 1392.0, 1392.0, 0.02342542126715912, 0.027688054889666264, 0.015022161424577952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b85a2360-8c0f-45bc-b3b7-4f0c11bbbb5b", 3, 0, 0.0, 396.33333333333337, 220, 747, 222.0, 747.0, 747.0, 747.0, 0.03341278150268416, 0.02715876152740962, 0.021426816263114518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=119fc4f7-f038-4fd7-84f7-678e6edc6315", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff92ea1e-823e-4a1f-904c-ecd320ec6634", 3, 0, 0.0, 431.33333333333337, 248, 710, 336.0, 710.0, 710.0, 710.0, 0.07573844988639232, 0.03426967621812674, 0.048569253345114874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 169.6875, 129, 408, 138.0, 396.1, 408.0, 408.0, 0.09419577414208255, 0.04682192288898439, 0.04728186319241253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, 100.0, 200.0, 130, 409, 132.0, 409.0, 409.0, 409.0, 0.10460387818878385, 0.05199548242001072, 0.05918444523986977], "isController": false}, {"data": ["register", 25, 7, 28.0, 960.4000000000001, 242, 1723, 1025.0, 1488.0000000000002, 1665.9999999999998, 1723.0, 0.1026980840645437, 0.03228571017779092, 0.0463344871463078], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.58974358974359, 1.1345218800648298], "isController": false}, {"data": ["401/Unauthorized", 7, 3.58974358974359, 1.1345218800648298], "isController": false}, {"data": ["404/Not Found", 181, 92.82051282051282, 29.3354943273906], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 617, 195, "404/Not Found", 181, "406/Not Acceptable", 7, "401/Unauthorized", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
