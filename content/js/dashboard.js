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

    var data = {"OkPercent": 66.13924050632912, "KoPercent": 33.860759493670884};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5157894736842106, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bbb105d-1fcf-4853-b3ff-1f343efe2a2b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17ab0e20-ced3-4efb-89dd-2fdecae9d509"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebcb0a77-685d-4bcf-8695-c3362d4cbe87"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7d9a390-961b-46da-9a66-5dc033a36ad3"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67704947-4df1-422f-b9bd-37ac55de61a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67704947-4df1-422f-b9bd-37ac55de61a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b06636a-dc28-4e47-9cfc-6e37da472f05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d75c8137-c8f7-41ad-af90-26af9d4aa1af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17146ae5-11e4-48ce-824e-87be86972e1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bdbb481b-bd38-4042-9c43-27c902b6874d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8cae69d-e9f1-4ebc-9b15-19a600fa2ba3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/166c35a6-ce9c-4c4d-94bb-d15072040b8c"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdbb481b-bd38-4042-9c43-27c902b6874d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17146ae5-11e4-48ce-824e-87be86972e1a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17ab0e20-ced3-4efb-89dd-2fdecae9d509"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e888a742-149f-4a63-9b84-072959d61ac0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8cae69d-e9f1-4ebc-9b15-19a600fa2ba3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9228723404255319, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=166c35a6-ce9c-4c4d-94bb-d15072040b8c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e888a742-149f-4a63-9b84-072959d61ac0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc2d4958-446c-4d6b-a275-2cbb4bd96943"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f1409b9-e0e4-45ec-9b8e-24567d316321"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d75c8137-c8f7-41ad-af90-26af9d4aa1af"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b06636a-dc28-4e47-9cfc-6e37da472f05"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc2d4958-446c-4d6b-a275-2cbb4bd96943"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bbb105d-1fcf-4853-b3ff-1f343efe2a2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/127962c9-b0d5-4d50-a100-c15fbe31d7d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f1409b9-e0e4-45ec-9b8e-24567d316321"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 632, 214, 33.860759493670884, 235.3212025316455, 99, 2126, 106.0, 441.4000000000001, 858.6500000000004, 1380.1799999999978, 2.5195042317306044, 2.5888991383554654, 1.207222215439538], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 58, 100.0, 576.0689655172415, 405, 763, 613.0, 729.5, 744.25, 763.0, 0.26442121387573114, 1.6995358310690367, 0.4438867838402166], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 141.3529411764706, 101, 317, 105.0, 306.59999999999997, 317.0, 317.0, 0.09874936829448223, 0.07666576933018884, 0.03510231451092923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 113.57894736842105, 99, 305, 103.0, 108.0, 305.0, 305.0, 0.09904964472456379, 0.0492346378562529, 0.049718278699634556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bbb105d-1fcf-4853-b3ff-1f343efe2a2b", 3, 0, 0.0, 252.66666666666666, 190, 362, 206.0, 362.0, 362.0, 362.0, 0.10358758330168157, 0.04680324401781707, 0.06642823538551845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, 100.0, 130.66666666666669, 100, 305, 103.0, 301.0, 304.7, 305.0, 0.10542115752430961, 0.05240172771472031, 0.05291647946044448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17ab0e20-ced3-4efb-89dd-2fdecae9d509", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 109.5, 109, 110, 109.5, 110.0, 110.0, 110.0, 0.16743407283382167, 0.049379970699037254, 0.1035017266638761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebcb0a77-685d-4bcf-8695-c3362d4cbe87", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 183.7586206896552, 99, 453, 103.0, 405.0, 412.05, 453.0, 0.2687972712442533, 0.13361114361652823, 0.1299361809237357], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 442.2, 102, 1041, 406.0, 840.6000000000001, 1041.0, 1041.0, 0.07563076054292803, 0.014815947817296251, 0.050922742547849065], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 442.2, 102, 1041, 406.0, 840.6000000000001, 1041.0, 1041.0, 0.07700956458792182, 0.015086053375329216, 0.05185110136512288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7d9a390-961b-46da-9a66-5dc033a36ad3", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 868.6818181818182, 154, 2126, 891.5, 1707.4999999999998, 2071.0999999999995, 2126.0, 0.08801513860383986, 0.027551613877586947, 0.039709955112279316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67704947-4df1-422f-b9bd-37ac55de61a4", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 106.2, 100, 113, 106.0, 113.0, 113.0, 113.0, 0.0265571802648282, 0.02090340556001126, 0.00944024767226315], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 388.2142857142857, 100, 635, 386.5, 619.5, 635.0, 635.0, 0.07475797106866519, 0.016885205798014644, 0.049977706105056315], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1092.3000000000002, 761, 1469, 1064.5, 1430.4, 1467.25, 1469.0, 0.08884900555750529, 0.045986301704568175, 0.04086707189217285], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 188.0, 99, 249, 201.0, 228.0, 249.0, 249.0, 0.07628734901462174, 0.16338703909726637, 0.04845438652256834], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, 100.0, 167.0, 101, 417, 104.0, 417.0, 417.0, 417.0, 0.027404167625812534, 0.01362179816556502, 0.013755607577800432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67704947-4df1-422f-b9bd-37ac55de61a4", 3, 0, 0.0, 431.6666666666667, 208, 635, 452.0, 635.0, 635.0, 635.0, 0.02802088489954513, 0.028102977335774264, 0.017969122152377573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b06636a-dc28-4e47-9cfc-6e37da472f05", 3, 0, 0.0, 320.0, 198, 396, 366.0, 396.0, 396.0, 396.0, 0.0861573808156232, 0.038983971137277425, 0.05525066412981045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d75c8137-c8f7-41ad-af90-26af9d4aa1af", 3, 0, 0.0, 256.0, 183, 384, 201.0, 384.0, 384.0, 384.0, 0.020101849370142054, 0.02769893502077191, 0.01289083439426427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17146ae5-11e4-48ce-824e-87be86972e1a", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdbb481b-bd38-4042-9c43-27c902b6874d", 3, 0, 0.0, 304.0, 174, 389, 349.0, 389.0, 389.0, 389.0, 0.04390522325806027, 0.02822682810373341, 0.02815536777942016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8cae69d-e9f1-4ebc-9b15-19a600fa2ba3", 3, 0, 0.0, 293.6666666666667, 191, 429, 261.0, 429.0, 429.0, 429.0, 0.017812717092489563, 0.02455626851780381, 0.011422868708399883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/166c35a6-ce9c-4c4d-94bb-d15072040b8c", 3, 0, 0.0, 399.6666666666667, 185, 518, 496.0, 518.0, 518.0, 518.0, 0.020634014485078168, 0.024388706573997016, 0.013232099132683592], "isController": false}, {"data": ["addBook", 65, 65, 100.0, 616.4461538461537, 405, 913, 608.0, 809.6, 868.9999999999998, 913.0, 0.3111164293406725, 0.9517096446093095, 0.6080465851980376], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdbb481b-bd38-4042-9c43-27c902b6874d", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.5032425139275766, 1.920482242339833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17146ae5-11e4-48ce-824e-87be86972e1a", 3, 0, 0.0, 502.6666666666667, 206, 929, 373.0, 929.0, 929.0, 929.0, 0.018538544724239145, 0.025556880503630468, 0.011888324579020547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17ab0e20-ced3-4efb-89dd-2fdecae9d509", 3, 0, 0.0, 340.33333333333337, 201, 604, 216.0, 604.0, 604.0, 604.0, 0.028589399050831955, 0.028673157055863686, 0.01833369665694627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e888a742-149f-4a63-9b84-072959d61ac0", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.2498811376210235, 0.953600449515906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8cae69d-e9f1-4ebc-9b15-19a600fa2ba3", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 123.95238095238096, 101, 299, 104.0, 262.0000000000001, 298.9, 299.0, 0.10461710140884363, 0.078156330642349, 0.037188110266424886], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 394.6428571428571, 109, 723, 386.5, 678.0, 723.0, 723.0, 0.0735599329553754, 0.014490321614535442, 0.04996698012830954], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 13, 6.914893617021277, 160.40957446808517, 100, 578, 106.5, 306.4, 382.19999999999993, 526.3799999999992, 0.7896704386031234, 1.6166274062896409, 0.3818198005137058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 115.35294117647061, 102, 304, 103.0, 146.39999999999986, 304.0, 304.0, 0.08729588168840505, 0.06760315837783712, 0.03103095794392523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=166c35a6-ce9c-4c4d-94bb-d15072040b8c", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, 100.0, 156.23076923076925, 100, 403, 103.0, 364.2, 403.0, 403.0, 0.07965393429163144, 0.03959360601019571, 0.03998254123622906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 118.0, 102, 306, 104.5, 175.10000000000014, 306.0, 306.0, 0.09613016023696085, 0.07801187808292427, 0.03417126789673217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 405.85, 143, 766, 396.5, 704.3000000000002, 763.1999999999999, 766.0, 0.0870534159760429, 0.05347324086809666, 0.039361066012605334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e888a742-149f-4a63-9b84-072959d61ac0", 3, 0, 0.0, 256.6666666666667, 183, 382, 205.0, 382.0, 382.0, 382.0, 0.04269186435371633, 0.02744675524042635, 0.027377269784121472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc2d4958-446c-4d6b-a275-2cbb4bd96943", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["login", 20, 5, 25.0, 1785.9, 1372, 2520, 1702.5, 2300.5, 2509.0499999999997, 2520.0, 0.09012216058867795, 0.13478719623199248, 0.13518324088301695], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8f1409b9-e0e4-45ec-9b8e-24567d316321", 3, 0, 0.0, 262.0, 178, 394, 214.0, 394.0, 394.0, 394.0, 0.020429704790765776, 0.028163997327113624, 0.013101080220640812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 17, 100.0, 136.52941176470586, 99, 305, 101.0, 300.2, 305.0, 305.0, 0.08661361158380632, 0.04305305497671622, 0.043475973002027775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 166.42105263157896, 101, 442, 109.0, 306.0, 442.0, 442.0, 0.09764069252945923, 0.07904700596379072, 0.03470821492258121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d75c8137-c8f7-41ad-af90-26af9d4aa1af", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.30569215313028764, 1.1665873519458545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 126.29411764705881, 99, 307, 102.0, 299.8, 307.0, 307.0, 0.10064173908925146, 0.05002602069963769, 0.050517435441284425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b06636a-dc28-4e47-9cfc-6e37da472f05", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc2d4958-446c-4d6b-a275-2cbb4bd96943", 3, 0, 0.0, 462.6666666666667, 183, 838, 367.0, 838.0, 838.0, 838.0, 0.04566140545806, 0.029355884042860842, 0.029281565349081447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 181.15384615384613, 101, 311, 106.0, 310.2, 311.0, 311.0, 0.07579777154551656, 0.06284405082240582, 0.026943739104070344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, 100.0, 121.19999999999999, 101, 365, 103.0, 215.60000000000008, 365.0, 365.0, 0.07576943864948552, 0.03766273854744935, 0.03803270650960504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bbb105d-1fcf-4853-b3ff-1f343efe2a2b", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/127962c9-b0d5-4d50-a100-c15fbe31d7d3", 2, 0, 0.0, 220.0, 191, 249, 220.0, 249.0, 249.0, 249.0, 0.019842450939540054, 0.0282522397166498, 0.012333710959977777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f1409b9-e0e4-45ec-9b8e-24567d316321", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 120.26666666666667, 101, 309, 105.0, 198.00000000000006, 309.0, 309.0, 0.07261988332405413, 0.05637969457287405, 0.025814099150347363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 119.0625, 99, 368, 102.5, 184.6000000000002, 368.0, 368.0, 0.097692622375274, 0.04856010233302194, 0.049037117090713706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, 100.0, 101.77777777777777, 99, 106, 101.0, 106.0, 106.0, 106.0, 0.06673142086024215, 0.03317020822056959, 0.037978114411021065], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 868.6818181818182, 154, 2126, 891.5, 1707.4999999999998, 2071.0999999999995, 2126.0, 0.08613770286407861, 0.02696391515436268, 0.03886290890937922], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.2710280373831777, 1.1075949367088607], "isController": false}, {"data": ["401/Unauthorized", 17, 7.94392523364486, 2.689873417721519], "isController": false}, {"data": ["404/Not Found", 190, 88.78504672897196, 30.063291139240505], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 632, 214, "404/Not Found", 190, "401/Unauthorized", 17, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
