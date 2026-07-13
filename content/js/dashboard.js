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

    var data = {"OkPercent": 97.33028222730739, "KoPercent": 2.669717772692601};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7239243807040417, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b763884b-4594-4b63-aa0e-a3a40ed8e79b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b80a036c-54f2-4f0c-9558-55d6f1afae53"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a6eb870-81b2-4c7c-bd70-89ee67fa7eb3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b195af4-c1f0-4f84-a43d-6c208c668084"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/483ec3cd-d51b-4e68-8847-37240060d802"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1afc2368-71d9-4939-8302-d8ef02fa60dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4ebb3ba3-f2dc-4050-84fc-ba67df4f4775"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37772cd8-8c82-43fd-928e-e781ccf7c707"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1afc2368-71d9-4939-8302-d8ef02fa60dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f98c145c-97a7-41c7-a54c-2ae5594df13d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36123dfb-aad3-4f39-a025-f1adf3a056f1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1caefc8b-9303-473e-8f36-c141d3c0d0f4"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09f136d1-2367-46d6-9a2c-733312808690"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=483ec3cd-d51b-4e68-8847-37240060d802"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62e61d2d-bfe6-4072-8c4c-639e474bf259"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/6b195af4-c1f0-4f84-a43d-6c208c668084"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6277505-f1f6-4edf-bd9f-803b8e96f413"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a6eb870-81b2-4c7c-bd70-89ee67fa7eb3"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c201fa3-144c-4ada-9642-b33f057a87f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac9d1d92-6810-4b62-9f80-fe743f0a5015"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c201fa3-144c-4ada-9642-b33f057a87f1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f98c145c-97a7-41c7-a54c-2ae5594df13d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37772cd8-8c82-43fd-928e-e781ccf7c707"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac9d1d92-6810-4b62-9f80-fe743f0a5015"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09f136d1-2367-46d6-9a2c-733312808690"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62e61d2d-bfe6-4072-8c4c-639e474bf259"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b763884b-4594-4b63-aa0e-a3a40ed8e79b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1caefc8b-9303-473e-8f36-c141d3c0d0f4"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 35, 2.669717772692601, 461.5537757437068, 127, 4486, 154.0, 1272.0, 1517.5999999999995, 1952.0, 5.146928920558271, 745.4041503800817, 3.759156986730267], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2195.2321428571427, 1620, 3234, 2198.0, 2597.6000000000004, 2789.6, 3234.0, 0.25039683426859527, 301.3107014953945, 1.2311992778734153], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b763884b-4594-4b63-aa0e-a3a40ed8e79b", 1, 0, 0.0, 831.0, 831, 831, 831.0, 831.0, 831.0, 831.0, 1.203369434416366, 0.21740561070998798, 0.829666817087846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b80a036c-54f2-4f0c-9558-55d6f1afae53", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.5632027116402117, 1.0523451278659612], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 489.18749999999994, 137, 1020, 509.0, 932.5000000000001, 1020.0, 1020.0, 0.08727336198808719, 0.018260075982370783, 0.05827457154233849], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 489.18749999999994, 137, 1020, 509.0, 932.5000000000001, 1020.0, 1020.0, 0.08541943612494728, 0.01787218182594722, 0.05703665961956318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 173.42857142857142, 131, 409, 133.0, 401.5, 409.0, 409.0, 0.07585567915215023, 0.028435297137531762, 0.04280639260190398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 157.2857142857143, 131, 406, 139.0, 279.5, 406.0, 406.0, 0.07586020048767272, 0.056376574776483335, 0.038078264697913845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 264.4285714285714, 132, 833, 145.5, 631.0, 833.0, 833.0, 0.07585403516376345, 1.61209931121827, 0.04420233047977677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a6eb870-81b2-4c7c-bd70-89ee67fa7eb3", 1, 0, 0.0, 982.0, 982, 982, 982.0, 982.0, 982.0, 982.0, 1.0183299389002036, 0.1839756237270876, 0.7020907586558045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 287.50000000000006, 131, 1440, 140.0, 933.5, 1440.0, 1440.0, 0.07585650117306661, 4.894400511828196, 0.044129688879978764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b195af4-c1f0-4f84-a43d-6c208c668084", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/483ec3cd-d51b-4e68-8847-37240060d802", 3, 0, 0.0, 858.6666666666666, 328, 1664, 584.0, 1664.0, 1664.0, 1664.0, 0.03288428021791316, 0.03298062088261408, 0.021087901051200824], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 247.0625, 134, 446, 238.5, 381.6000000000001, 446.0, 446.0, 0.08799863602114168, 0.133136608257572, 0.05686825916698291], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1afc2368-71d9-4939-8302-d8ef02fa60dc", 3, 0, 0.0, 362.6666666666667, 232, 539, 317.0, 539.0, 539.0, 539.0, 0.046051116739580934, 0.030146092370864994, 0.029531477857088036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 180.6842105263158, 131, 423, 136.0, 417.0, 423.0, 423.0, 0.12227928588897041, 0.09087357086084617, 0.0613784696747371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 945.8749999999999, 645, 1180, 1034.0, 1180.0, 1180.0, 1180.0, 0.04202563563773902, 12.356932259928556, 0.023967745324648033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 204.57894736842104, 130, 410, 134.0, 405.0, 410.0, 410.0, 0.12228794305243579, 0.052055342534964695, 0.06866126078869286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1251.375, 1050, 1530, 1173.5, 1530.0, 1530.0, 1530.0, 0.04203513086061676, 37.82328463826143, 0.023932110636464426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 233.0, 132, 401, 139.0, 401.0, 401.0, 401.0, 0.04219809897564114, 0.07467085482799, 0.02336554894452005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 166.5, 132, 395, 134.5, 395.0, 395.0, 395.0, 0.04761111243364201, 0.03538286773632966, 0.023898546670792966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 165.625, 129, 397, 132.5, 397.0, 397.0, 397.0, 0.04761281260787278, 0.012740147123590959, 0.027154182190427447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 132.375, 130, 140, 131.5, 140.0, 140.0, 140.0, 0.04761224586963767, 0.012832988144550778, 0.02799079298195496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 200.875, 131, 401, 137.0, 401.0, 401.0, 401.0, 0.047609129050495434, 0.012832148064391348, 0.02803545392328979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 134.625, 129, 142, 133.5, 142.0, 142.0, 142.0, 0.04225761297308719, 0.03140433932863217, 0.02372864009719251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 914.4374999999997, 131, 1786, 1284.0, 1706.2, 1786.0, 1786.0, 0.10168478986202645, 51.47857653408983, 0.054864107811298454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 363.10526315789474, 131, 1516, 144.0, 1427.0, 1516.0, 1516.0, 0.12206247028742499, 11.590702353075333, 0.07065519841575763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 688.0625000000001, 131, 1267, 851.0, 1229.2, 1267.0, 1267.0, 0.10168672861083218, 16.830332813512896, 0.054964457310640244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 275.52631578947376, 130, 1063, 139.0, 780.0, 1063.0, 1063.0, 0.12229187853198255, 3.8145310911010126, 0.07090741579560521], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 447.50000000000006, 139, 982, 358.5, 954.0, 982.0, 982.0, 0.08556332755780872, 0.017902288016855974, 0.05746697121863569], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 369.12500000000006, 266, 793, 271.0, 793.0, 793.0, 793.0, 0.04757062751604022, 0.07372518151167562, 0.10698745622015687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ebb3ba3-f2dc-4050-84fc-ba67df4f4775", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.44976892605633806, 0.8403939260563381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 539.375, 168, 1530, 488.5, 821.5, 1360.75, 1530.0, 0.10256980088637402, 0.06300430152102468, 0.04637677520546013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 154.1875, 129, 393, 134.5, 229.20000000000016, 393.0, 393.0, 0.10168543610341409, 0.07556896179169738, 0.05104132241909652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 217.375, 127, 421, 137.5, 406.3, 421.0, 421.0, 0.101689313724244, 0.11312191357043891, 0.05319076041362128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37772cd8-8c82-43fd-928e-e781ccf7c707", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["login", 24, 0, 0.0, 2985.4166666666665, 1466, 5925, 2772.5, 4218.0, 5508.25, 5925.0, 0.10535557506584724, 42.155639541264264, 0.21719298726953468], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 168.78947368421052, 133, 412, 142.0, 412.0, 412.0, 412.0, 0.11200518760868924, 0.09067607473398769, 0.039814344032776255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1afc2368-71d9-4939-8302-d8ef02fa60dc", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f98c145c-97a7-41c7-a54c-2ae5594df13d", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36123dfb-aad3-4f39-a025-f1adf3a056f1", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1caefc8b-9303-473e-8f36-c141d3c0d0f4", 3, 0, 0.0, 1295.6666666666667, 256, 3373, 258.0, 3373.0, 3373.0, 3373.0, 0.022109382484947194, 0.022174156066446064, 0.014178217283641268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1089.0000000000002, 269, 1935, 1414.5, 1852.4, 1935.0, 1935.0, 0.10159891289163206, 68.43942507119861, 0.2138761294941644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 487.21428571428567, 266, 1584, 292.0, 1208.5, 1584.0, 1584.0, 0.07579818192646494, 6.586294157516743, 0.1690866251400913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 780.9375, 133, 1662, 789.5, 1600.4, 1662.0, 1662.0, 0.08069763102016936, 48.28200732835362, 0.11771688118786913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09f136d1-2367-46d6-9a2c-733312808690", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1152.7083333333333, 375, 3444, 965.5, 1870.0, 3089.5, 3444.0, 0.10566821940244622, 0.03302131856326444, 0.04767452867571304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 144.73684210526318, 133, 175, 142.0, 174.0, 175.0, 175.0, 0.09557247915010915, 0.07419933684017263, 0.033973029697890365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 601.9473684210526, 270, 1935, 539.0, 1563.0, 1935.0, 1935.0, 0.12194808862416882, 15.526186697308798, 0.27097973455431185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=483ec3cd-d51b-4e68-8847-37240060d802", 1, 0, 0.0, 885.0, 885, 885, 885.0, 885.0, 885.0, 885.0, 1.1299435028248588, 0.2041401836158192, 0.7790430790960452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62e61d2d-bfe6-4072-8c4c-639e474bf259", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 443.78947368421046, 270, 1298, 284.0, 817.0, 1298.0, 1298.0, 0.11494878729029409, 7.406598911162737, 0.2569745838400155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 134.81818181818184, 130, 142, 134.0, 141.4, 142.0, 142.0, 0.052416895394937484, 0.03895435292533928, 0.02631082444628698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 159.8181818181818, 131, 395, 138.0, 344.8000000000002, 395.0, 395.0, 0.052417145171666145, 0.014025681422887232, 0.029894153105715852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 159.1818181818182, 127, 422, 132.0, 367.0000000000002, 422.0, 422.0, 0.052420142678097435, 0.01412886658120595, 0.030817310441615876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 133.27272727272728, 128, 141, 133.0, 140.6, 141.0, 141.0, 0.05242039248577501, 0.014128933912181545, 0.030868649090744462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 146.0, 139, 163, 141.0, 163.0, 163.0, 163.0, 0.02429484220499988, 0.007165080415927698, 0.015018198355239182], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1480.9642857142853, 1033, 2656, 1390.0, 2002.8000000000002, 2204.85, 2656.0, 0.24864576858183107, 297.4667824793535, 0.49097826569576414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1152.7083333333333, 375, 3444, 965.5, 1870.0, 3089.5, 3444.0, 0.10555900088405663, 0.0329871877762677, 0.04762525235198649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 258.0, 132, 597, 137.5, 597.0, 597.0, 597.0, 0.029830710716682828, 0.008040308747855917, 0.017566326720859126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 258.5, 128, 590, 138.5, 590.0, 590.0, 590.0, 0.029830562405536554, 0.008040268773367274, 0.017537107976692386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 300.94736842105266, 130, 1441, 138.0, 1430.0, 1441.0, 1441.0, 0.09731163795973347, 9.240434249983355, 0.05632831346127253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 244.73684210526318, 130, 1047, 136.0, 1046.0, 1047.0, 1047.0, 0.09731163795973347, 3.0353468519685123, 0.056423344357717585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 135.33333333333334, 131, 140, 135.0, 140.0, 140.0, 140.0, 0.029830710716682828, 0.007982045640987397, 0.017012827205608174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 167.42105263157896, 130, 427, 139.0, 411.0, 427.0, 427.0, 0.09730814930142992, 0.0723159195492072, 0.048844129629819315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b195af4-c1f0-4f84-a43d-6c208c668084", 2, 0, 0.0, 545.0, 303, 787, 545.0, 787.0, 787.0, 787.0, 0.130872922392357, 0.07700286693495616, 0.08134825693626489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 231.83333333333334, 134, 425, 143.0, 425.0, 425.0, 425.0, 0.029829079375180218, 0.022167899809093894, 0.014972799608244759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 176.99999999999997, 129, 399, 135.0, 398.0, 399.0, 399.0, 0.09731313317558361, 0.0414241040789568, 0.054638603351669174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 194.5, 145, 395, 156.5, 395.0, 395.0, 395.0, 0.029887324785558445, 0.02352459353238292, 0.010624009982366478], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 712.0, 133, 3373, 558.0, 2104.000000000001, 3373.0, 3373.0, 0.082064524600209, 0.016728126726774373, 0.055837001731561475], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f6277505-f1f6-4edf-bd9f-803b8e96f413", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1595.6666666666665, 947, 4486, 1472.0, 1915.0, 3852.5, 4486.0, 0.10473626100276243, 0.05420919758932039, 0.048174588801075294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 494.5, 277, 1023, 280.5, 1023.0, 1023.0, 1023.0, 0.029809369084703323, 0.046198699938890794, 0.0670419697285857], "isController": false}, {"data": ["addBook", 56, 11, 19.642857142857142, 1348.2321428571431, 682, 2778, 1093.0, 2413.5, 2575.25, 2778.0, 0.2552473848538025, 82.83085658857311, 0.9262376720640852], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6a6eb870-81b2-4c7c-bd70-89ee67fa7eb3", 3, 0, 0.0, 316.3333333333333, 220, 506, 223.0, 506.0, 506.0, 506.0, 0.021355049045429307, 0.025240945014307882, 0.013694481321450435], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 238.05357142857147, 132, 764, 141.5, 532.3, 561.6, 764.0, 0.25022229570019794, 0.1859562178006354, 0.12095706676913866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c201fa3-144c-4ada-9642-b33f057a87f1", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 884.3750000000001, 643, 1387, 827.5, 1109.7, 1302.2, 1387.0, 0.250174228480549, 73.55952973946141, 0.1258200465502761], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 202.55357142857142, 129, 541, 139.0, 406.90000000000003, 425.7, 541.0, 0.25067144136078784, 0.44357094897045657, 0.12190857206803939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac9d1d92-6810-4b62-9f80-fe743f0a5015", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1238.6785714285713, 876, 2120, 1189.5, 1513.7, 1603.7499999999995, 2120.0, 0.24952212058156475, 224.52044271239455, 0.12524840818254326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 156.1052631578947, 134, 403, 142.0, 160.0, 403.0, 403.0, 0.11669471434362294, 0.08717915671178862, 0.04148132423933471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, 6.5476190476190474, 203.35119047619045, 131, 1120, 144.0, 349.2, 420.65, 1095.16, 0.6719838723870627, 1.52119786625121, 0.32047277740334235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 223.1818181818182, 134, 439, 150.0, 436.6, 439.0, 439.0, 0.05209393958050171, 0.04034227938216588, 0.018517767585256466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 161.35714285714286, 135, 411, 143.5, 281.5, 411.0, 411.0, 0.07674512942517898, 0.062280471242503646, 0.027280495225356593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c201fa3-144c-4ada-9642-b33f057a87f1", 3, 0, 0.0, 372.0, 239, 460, 417.0, 460.0, 460.0, 460.0, 0.06777210500158135, 0.030665112614647813, 0.04346062723083179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f98c145c-97a7-41c7-a54c-2ae5594df13d", 3, 0, 0.0, 939.0, 225, 1334, 1258.0, 1334.0, 1334.0, 1334.0, 0.02572854668015986, 0.021448830744755665, 0.01649910057288897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37772cd8-8c82-43fd-928e-e781ccf7c707", 3, 0, 0.0, 420.3333333333333, 225, 558, 478.0, 558.0, 558.0, 558.0, 0.01822356671647775, 0.02512265789201929, 0.011686336728991263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 299.54545454545456, 265, 553, 274.0, 499.8000000000002, 553.0, 553.0, 0.052381451251916684, 0.08118101868827322, 0.11780711155582435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac9d1d92-6810-4b62-9f80-fe743f0a5015", 3, 0, 0.0, 427.66666666666663, 238, 725, 320.0, 725.0, 725.0, 725.0, 0.0644122383252818, 0.029144860440150293, 0.041306025228126673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 485.68421052631584, 271, 1869, 281.0, 1569.0, 1869.0, 1869.0, 0.09723892627754037, 12.380265575820772, 0.21607373045625528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09f136d1-2367-46d6-9a2c-733312808690", 3, 0, 0.0, 460.3333333333333, 307, 628, 446.0, 628.0, 628.0, 628.0, 0.021747167431442053, 0.021810879836026354, 0.01394593744789741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 205.37499999999997, 134, 416, 138.0, 416.0, 416.0, 416.0, 0.04576632856791438, 0.037944934525546196, 0.016268499608125812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 145.8125, 132, 167, 144.5, 161.4, 167.0, 167.0, 0.10369141435089174, 0.08050261172749897, 0.03685905744504355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62e61d2d-bfe6-4072-8c4c-639e474bf259", 3, 0, 0.0, 436.0, 343, 611, 354.0, 611.0, 611.0, 611.0, 0.10330578512396695, 0.04788653581267218, 0.06624752496556474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b763884b-4594-4b63-aa0e-a3a40ed8e79b", 3, 0, 0.0, 658.0, 250, 1097, 627.0, 1097.0, 1097.0, 1097.0, 0.03000810218759065, 0.025016520085423065, 0.01924347698878697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 150.10526315789474, 131, 393, 135.0, 143.0, 393.0, 393.0, 0.1150483202945237, 0.08549977709387943, 0.057748863897837094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 205.1052631578947, 130, 418, 135.0, 410.0, 418.0, 418.0, 0.11504135433948098, 0.03987658787343029, 0.06510101312076921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 232.89473684210526, 130, 1165, 135.0, 424.0, 1165.0, 1165.0, 0.11504414062026957, 5.477634936559212, 0.0671130240563353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1caefc8b-9303-473e-8f36-c141d3c0d0f4", 1, 0, 0.0, 942.0, 942, 942, 942.0, 942.0, 942.0, 942.0, 1.0615711252653928, 0.19178775212314225, 0.7319035297239915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 267.3157894736842, 131, 1037, 140.0, 424.0, 1037.0, 1037.0, 0.1150434440374194, 1.8097227793587842, 0.0672249648057885], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.857142857142858, 0.6102212051868803], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.30511060259344014], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.428571428571429, 0.30511060259344014], "isController": false}, {"data": ["401/Unauthorized", 19, 54.285714285714285, 1.4492753623188406], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 35, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
